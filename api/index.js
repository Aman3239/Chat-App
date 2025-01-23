const express = require("express")
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const crypto = require('crypto')


const app = express()
const port = 8000;
const cors = require('cors');
app.use(cors());


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

const jwt = require('jsonwebtoken');

mongoose.connect("mongodb+srv://aman:aman@cluster0.tsp6y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Connected to mongoDB")
}).catch(error => {
    console.log("Error connecting to the mongoDB")
})

app.listen(port, () => {
    console.log("Server is running on Port 8000")
})

const User = require("./models/user")
const Message = require("./models/message")

app.post("/register", async (req, res) => {
    const { name, email, password, image } = req.body;
    const newUser = new User({ name, email, password, image });

    newUser.save().then(() => {
        res.status(200).json({ message: "User is resgistered successfully!" })
    }).catch((error) => {
        console.log("Error creating a user",error);
        res.status(500).json({ message: "Error registering the user" })
    })
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email" })
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" })
        }
        const secretKey = crypto.randomBytes(32).toString('hex')
        const token = jwt.sign({ userId: user._id }, secretKey);
        res.status(200).json({ token })
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: "Error in login" })
    }
})

app.get("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        const users = await User.find({ _id: { $ne: userId } });

        res.json(users)
    } catch (error) {
        console.log("Error", error)
    }
})

app.post("/sendrequest", async (req, res) => {

    const { senderId, receiverId, message } = req.body;

    console.log(senderId)
    console.log(receiverId)
    console.log(message)

    const receiver = await User.findById(receiverId)


    if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
    };

    receiver.requests.push({ from: senderId, message })
    await receiver.save();

    res.status(200).json({ message: "Message sent successfully" })

})

app.get('/getrequests/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate(
            'requests.from',
            'name email image',
        );

        if (user) {
            res.json(user.requests);
        } else {
            res.status(400);
            throw new Error('User not found');
        }
    } catch (error) {
        console.log('error', error);
    }
});

app.post("/acceptrequest", async (req, res) => {
    try {
        const { userId, requestId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $pull: { requests: { from: requestId } }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Request not found" });
        }

        await User.findByIdAndUpdate(userId, {
            $push: { friends: requestId }
        })

        const friendUser = await User.findByIdAndUpdate(requestId, {
            $push: { friends: userId }
        })

        if (!friendUser) {
            return res.status(404).json({ message: "Friend not found" })
        }

        res.status(200).json({ message: "Request accepted successfully" })
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ message: "Server Error" })
    }
})

app.get("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const users = await User.findById(userId).populate("friends", "name email image")

        res.json(users.friends)
    } catch (error) {
        console.log("Error fetching user", error)
    }
})

const http = require('http').createServer(app);

const io = require("socket.io")(http);

// {"userId":"socketId"}
const userSocketMap = {};
io.on('connection', socket => {
    console.log("A user is connected", socket.id);

    const userId = socket.handshake.query.userId;

    console.log("userId", userId);

    if (userId !== "umdefined") {
        userSocketMap[userId] = socket.id
    }

    console.log("user socket data", userSocketMap)

    socket.on("disconnect", () => {
        console.log("USer disconnected", socket.id);
        delete userSocketMap[userId];
    })


    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const receiverSocketId = userSocketMap[receiverId]

        console.log("receiverId", receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiverMessage', {
                senderId,
                message
            })
        }
    })
})

http.listen(6000,()=>{
    console.log("Socket.IO running on port 6000")
})

app.post('/sendMessage',async(req,res)=>{
    try {
        const {senderId,receiverId,message} = req.body;

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        await newMessage.save();
        const receiverSocketId = userSocketMap[receiverId]
        if(receiverSocketId){
            console.log("emitting recieveMessage event to the reciver",receiverId);
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }else{
            console.log("Reciver socket io not found");
        }
        res.status(201).json(newMessage)
        
    } catch (error) {
        console.log("Error",error)
    }
})

app.get("/messages",async(req,res)=>{
    try {
       const {senderId,receiverId} = req.query;
       const messages = await Message.find({
        $or:[
            {senderId:senderId,receiverId:receiverId},
            {senderId:receiverId,receiverId:senderId}
        ]
       }) .populate('senderId','_id name')
       res.status(200).json(messages);
    } catch (error) {
        console.log("Error",error)
    }
})