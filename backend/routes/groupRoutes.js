import express from "express";
import User from "../models/User.js";
import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessage.js";

const router = express.Router();

// Log all incoming requests to this router
router.use((req, res, next) => {
  console.log(`[groupRoutes] ${req.method} ${req.path}`);
  next();
});
import multer from "multer";
import path from "path";
import fs from "fs";


// ==== STATIC ROUTES (no parameters) ====
// ✅ Proper folder setup for group files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/chat_files/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// create group
router.post("/create", async (req, res) => {
  try {
    const { name, adminEmail, memberEmails, image } = req.body;
    if (!name || !adminEmail || !Array.isArray(memberEmails)) {
      return res.status(400).json({ message: "Invalid data" });
    }
    // memberEmails = array of friend emails (exclude admin)
    if (memberEmails.length < 1 || memberEmails.length > 5) {
      return res.status(400).json({ message: "Select between 1 and 5 members" });
    }
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const members = await User.find({ email: { $in: memberEmails } });
    const memberIds = members.map(m => m._id);

  const group = new Group({ name, image: image || null, admin: admin._id, members: [admin._id, ...memberIds] });
    await group.save();

    const populated = await Group.findById(group._id).populate("members", "name email profilePic");
    return res.status(201).json({ success: true, group: populated });
  } catch (err) {
    console.error("Error creating group:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// send group message
router.post("/send", upload.single("file"), async (req, res) => {
  try {
    const { groupId, senderEmail, text } = req.body;
    if (!groupId || !senderEmail) return res.status(400).json({ message: "Invalid data" });

    const sender = await User.findOne({ email: senderEmail });
    if (!sender) return res.status(404).json({ message: "Sender not found" });

    const group = await Group.findById(groupId).populate("members", "email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    let fileUrl = null;
    let fileType = "text";
    let fileName = null;

    if (req.file) {
      // Build absolute URL so the frontend (running on a different origin) can fetch the file
      const host = req.get("host");
      const protocol = req.protocol;
      fileUrl = `${protocol}://${host}/uploads/chat_files/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();

      if ([".mp3", ".wav", ".webm", ".m4a"].includes(ext)) fileType = "audio";
      else if (ext === ".pdf") fileType = "pdf";
      else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) fileType = "image";
      fileName = req.file.originalname;
    }

  const gm = new GroupMessage({ groupId: group._id, senderId: sender._id, text: text || "", fileUrl, fileType, fileName, seenBy: [sender._id] });
    await gm.save();
  const populated = await GroupMessage.findById(gm._id).populate("senderId", "name email").populate("seenBy", "name email");

    // Emit to each member via Socket.IO (use app-level maps set in server.js)
    try {
      const io = req.app.get("io");
      const userConnections = req.app.get("userConnections");
      if (io && userConnections) {
        group.members.forEach(m => {
          const email = m.email;
          const sockets = userConnections[email];
          if (sockets) {
            sockets.forEach(socketId => {
              io.to(socketId).emit("receiveGroupMessage", { groupId: group._id, ...populated.toObject() });
            });
          }
        });
      }
    } catch (e) {
      console.error("Emit error:", e);
    }

    return res.status(201).json({ success: true, message: populated });
  } catch (err) {
    console.error("Error sending group message:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get groups for a user (non-parameterized, must come before /:groupId routes)
router.get("/my", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const groups = await Group.find({ members: user._id }).populate("members", "name email profilePic");
    return res.json(groups);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ==== PARAMETERIZED ROUTES ====(come after static routes)

// get group messages
router.get("/:groupId/messages", async (req, res) => {
  try {
    const { groupId } = req.params;
    const msgs = await GroupMessage.find({ groupId }).sort({ createdAt: 1 }).populate("senderId", "name email").populate("seenBy", "name email");
    return res.json(msgs);
  } catch (err) {
    console.error("Error fetching group messages:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// mark messages as seen by this user in a group
router.post("/:groupId/mark-seen", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;
    console.log(`[mark-seen] POST /:groupId/mark-seen called with groupId=${groupId}, email=${email}`);
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // add user to seenBy of all messages in the group that don't already include them
    await GroupMessage.updateMany(
      { groupId, seenBy: { $ne: user._id } },
      { $push: { seenBy: user._id } }
    );

    // return updated messages
    const msgs = await GroupMessage.find({ groupId }).sort({ createdAt: 1 }).populate("senderId", "name email").populate("seenBy", "name email");
    console.log(`[mark-seen] Returned ${msgs.length} messages`);
    return res.json(msgs);
  } catch (err) {
    console.error("Error marking messages seen:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get group info
router.get("/:groupId/info", async (req, res) => {
  try {
    const { groupId } = req.params;
    // populate members and admin so frontend can tell who is admin
    const group = await Group.findById(groupId)
      .populate("members", "name email profilePic")
      .populate("admin", "name email profilePic");
    if (!group) return res.status(404).json({ message: "Group not found" });
    return res.json(group);
  } catch (err) {
    console.error("Error fetching group info:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// update group (name, image, add/remove members)
router.post('/:groupId/update', upload.single('image'), async (req, res) => {
  try {
    const { groupId } = req.params;
    const { adminEmail, name, addMemberEmails, removeMemberEmails } = req.body;

    if (!adminEmail) return res.status(400).json({ message: 'adminEmail required' });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // verify admin (caller must provide their email)
    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) return res.status(404).json({ message: 'Admin user not found' });
    if (String(group.admin) !== String(adminUser._id)) {
      // Not admin: allow only name/image edits (per frontend rules)
      // we'll allow name/image edits for non-admins as requested
    }

    // handle image upload
    if (req.file) {
      const host = req.get('host');
      const protocol = req.protocol;
      group.image = `${protocol}://${host}/uploads/chat_files/${req.file.filename}`;
    }

    // update name if provided
    if (typeof name === 'string' && name.trim().length > 0) {
      group.name = name.trim();
    }

    // If caller is admin, handle add/remove members
    if (String(group.admin) === String(adminUser._id)) {
      // add members
      if (addMemberEmails) {
        let emailsToAdd = [];
        try { emailsToAdd = JSON.parse(addMemberEmails); } catch (e) { emailsToAdd = Array.isArray(addMemberEmails) ? addMemberEmails : [addMemberEmails]; }
        if (emailsToAdd.length) {
          const usersToAdd = await User.find({ email: { $in: emailsToAdd } });
          usersToAdd.forEach(u => {
            if (!group.members.includes(u._id)) group.members.push(u._id);
          });
        }
      }

      // remove members
      if (removeMemberEmails) {
        let emailsToRemove = [];
        try { emailsToRemove = JSON.parse(removeMemberEmails); } catch (e) { emailsToRemove = Array.isArray(removeMemberEmails) ? removeMemberEmails : [removeMemberEmails]; }
        if (emailsToRemove.length) {
          const usersToRemove = await User.find({ email: { $in: emailsToRemove } });
          usersToRemove.forEach(u => {
            // never remove admin
            if (String(u._id) === String(group.admin)) return;
            group.members = group.members.filter(mid => String(mid) !== String(u._id));
          });
        }
      }
    }

    await group.save();
    const populated = await Group.findById(group._id).populate('members', 'name email profilePic').populate('admin', 'name email profilePic');
    return res.json({ success: true, group: populated });
  } catch (err) {
    console.error('Error updating group:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// delete group (admin only) - removes group and its messages
router.delete('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    // Accept adminEmail in either the JSON body or the query string to be more robust
    const adminEmail = req.body?.adminEmail || req.query?.adminEmail;
    if (!adminEmail) return res.status(400).json({ message: 'adminEmail required' });

    // Helpful debug log so we can see delete attempts in server console
    console.log(`[groupRoutes] DELETE /${groupId} requested by adminEmail=${adminEmail}`);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) return res.status(404).json({ message: 'Admin user not found' });
    if (String(group.admin) !== String(adminUser._id)) {
      return res.status(403).json({ message: 'Only the group admin can delete this group' });
    }

    // delete all group messages
    await GroupMessage.deleteMany({ groupId: group._id });
    // delete group
    await Group.findByIdAndDelete(group._id);

    return res.json({ success: true, message: 'Group deleted' });
  } catch (err) {
    console.error('Error deleting group:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;