const socketIo = require('socket.io');

module.exports = (server) => {
  // Create a new instance of Socket.IO and pass the HTTP server instance to it
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  // Initialize maps to store information about rooms, users, and their code
  const roomUserCounts = new Map();
  const roomMentorIds = new Map();
  const roomStudentCodes = new Map();

  // Handle incoming socket connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a room
    socket.on('joinRoom', ({ roomId }) => {
      // Join the specified room
      socket.join(roomId);
      const usersInRoom = roomUserCounts.get(roomId) || 0;
      let studentCodesMap = roomStudentCodes.get(roomId) || new Map();

      // Check if this is the first user in the room, assign them as the mentor
      if (usersInRoom === 0) {
        roomMentorIds.set(roomId, socket.id);
        socket.emit('assignRole', { role: 'mentor', count: 1 });
        console.log(`Mentor assigned to room ${roomId}: ${socket.id}`);
      } else {
        // If not the first user, assign them as a student
        socket.emit('assignRole', { role: 'student', count: usersInRoom + 1 });
        io.to(roomId).emit('userCountUpdated', { count: usersInRoom + 1 });
        console.log(`Student joined room ${roomId}: ${socket.id}`);

        // Add the student to the room's code map
        studentCodesMap.set(socket.id, "");
        roomStudentCodes.set(roomId, studentCodesMap);
        // Notify the mentor that a new student has joined
        const mentorId = roomMentorIds.get(roomId);
        if (mentorId) {
          io.to(mentorId).emit('newStudentEditor', { studentId: socket.id, code: "" });
        }
      }

      // Update the count of users in the room
      roomUserCounts.set(roomId, usersInRoom + 1);
    });

    // Handle leaving a room
    socket.on('leaveRoom', ({ roomId }) => {
      socket.leave(roomId);
      const usersInRoom = roomUserCounts.get(roomId) || 0;
      const updatedCount = Math.max(0, usersInRoom - 1);

      // If the leaving user was the mentor, remove them from the mentor list
      if (socket.id === roomMentorIds.get(roomId)) {
        roomMentorIds.delete(roomId);
        // Notify the room that the mentor has disconnected
        io.to(roomId).emit('mentorLeft');
      } else {
        // Notify the mentor that a student has left and remove their editor
        const mentorId = roomMentorIds.get(roomId);
        if (mentorId) {
          io.to(mentorId).emit('removeStudentEditor', { studentId: socket.id });
        }
      }

      // Update the count of users in the room
      roomUserCounts.set(roomId, updatedCount);
      io.to(roomId).emit('userCountUpdated', { count: updatedCount });

      // If there are no users left in the room, remove the room's data
      if (updatedCount === 0) {
        roomStudentCodes.delete(roomId);
      } else {
        // Remove the leaving user's code state
        let studentCodesMap = roomStudentCodes.get(roomId);
        if (studentCodesMap) {
          studentCodesMap.delete(socket.id);
          if (studentCodesMap.size === 0) {
            roomStudentCodes.delete(roomId);
          } else {
            roomStudentCodes.set(roomId, studentCodesMap);
          }
        }
      }

      console.log(`User left room ${roomId}: ${socket.id}, updated count: ${updatedCount}`);
    });

    // Handle code changes from students
    socket.on('codeChange', ({ roomId, newCode }) => {
      if (socket.id !== roomMentorIds.get(roomId)) {
        let studentCodesMap = roomStudentCodes.get(roomId);
        if (studentCodesMap) {
          studentCodesMap.set(socket.id, newCode);
          roomStudentCodes.set(roomId, studentCodesMap);
          const mentorId = roomMentorIds.get(roomId);
          if (mentorId) {
            io.to(mentorId).emit('codeUpdate', { studentId: socket.id, newCode });
          }
        }
      }
    });

    // Handle mentor's solution
    socket.on('mentorSolution', ({ roomId, mentorSolution }) => {
      // Broadcast the mentor's solution to all clients in the room
      io.to(roomId).emit('mentorSolution', { mentorSolution });
    });

    // Handle disconnection of users
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      // Iterate over all rooms the socket is currently in
      const rooms = Array.from(socket.rooms);
      rooms.forEach((roomId) => {
        if (roomId !== socket.id) { // Avoid the socket's own room
          const usersInRoom = roomUserCounts.get(roomId) || 0;
          const updatedCount = Math.max(0, usersInRoom - 1);

          // Update the count of users in the room
          roomUserCounts.set(roomId, updatedCount);
          io.to(roomId).emit('userCountUpdated', { count: updatedCount });

          // If the leaving user was the mentor, remove them from the mentor list
          if (socket.id === roomMentorIds.get(roomId)) {
            roomMentorIds.delete(roomId);
            // Notify the room that the mentor has disconnected
            io.to(roomId).emit('mentorLeft');
          } else {
            // If a student disconnects, notify the mentor to remove their editor
            let studentCodesMap = roomStudentCodes.get(roomId);
            if (studentCodesMap) {
              studentCodesMap.delete(socket.id);
              if (studentCodesMap.size === 0) {
                roomStudentCodes.delete(roomId);
              } else {
                roomStudentCodes.set(roomId, studentCodesMap);
              }
              const mentorId = roomMentorIds.get(roomId);
              if (mentorId) {
                io.to(mentorId).emit('removeStudentEditor', { studentId: socket.id });
              }
            }
          }

          // If the room is empty, clear its data
          if (updatedCount === 0) {
            roomUserCounts.delete(roomId);
            roomStudentCodes.delete(roomId);
          }

          console.log(`User ${socket.id} disconnected from room ${roomId}, updated count: ${updatedCount}`);
        }
      });
    });
  });

  return io;
};
