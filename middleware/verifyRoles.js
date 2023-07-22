// const jwt = require('jsonwebtoken')
// const userSchema = require("../models/User")
// const verifyRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
//     if (token) {
//       jwt.verify(token, process.env.TOKEN, async (err, decoded) => {
//         if (err) res.status(401).json({ 'message': 'UnAuthMessage' })
//         else {
//           if (allowedRoles.includes(decoded.role)) {
//             if (decoded.role === 2001) {
//               try {
//                 const customer = await userSchema.findOne({ email: decoded.email })
//                 if (!customer) res.status(401).json({ "message": " Cannot Find This User" })
//                 if (!(customer.email === decoded.email)) res.status(401).json({ "message": "You Cannot Access This Page" })
//                 req.user = decoded
//                 next()
//               } catch (error) {
//                 res.status(500).json({"message":error.message})
//               }
//             }
//             else {
//               req.user = decoded
//               next()
//             }
         
//           }
//           else res.status(401).json({ 'message': `${decoded.role} doesn't have permission to this api.` })
//         }
//       })
//     } else res.status(401).json({ 'message': 'UnAuth' })
//   }
// }
// module.exports = verifyRoles;


const jwt = require('jsonwebtoken')
const userSchema = require("../models/User")

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const excludedPaths = ['/main/feedback']; // Add the path of the excluded API endpoint here
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]

    if (excludedPaths.includes(req.originalUrl)) {
      next(); // Skip verification for excluded API endpoint
    } else {
      if (token) {
        jwt.verify(token, process.env.TOKEN, async (err, decoded) => {
          if (err) res.status(401).json({ 'message': 'UnAuthMessage' })
          else {
            if (allowedRoles.includes(decoded.role)) {
              if (decoded.role === 2001) {
                try {
                  const customer = await userSchema.findOne({ email: decoded.email })
                  if (!customer) res.status(401).json({ "message": " Cannot Find This User" })
                  if (!(customer.email === decoded.email)) res.status(401).json({ "message": "You Cannot Access This Page" })
                  req.user = decoded
                  next()
                } catch (error) {
                  res.status(500).json({"message":error.message})
                }
              }
              else {
                req.user = decoded
                next()
              }

            }
            else res.status(401).json({ 'message': `${decoded.role} doesn't have permission to this api.` })
          }
        })
      } else res.status(401).json({ 'message': 'UnAuth' })
    }
  }
}

module.exports = verifyRoles;