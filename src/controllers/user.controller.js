import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { passwordHashing } from "../utils/HashPassword.js";
import { nodeMailer } from "../utils/NodeMailer.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  // 1. Check whether something is coming in the body or not
  // 2. check whether any field is empty
  // 3. verify for the email is correct or not
  // 4. user exist already or not by email or username
  // 4. generate the otp
  // 5. save the user to the db
  // 6. sending the data in response except password

  if (!req.body) {
    throw new ApiError(
      400,
      { message: "req.body is not sent" },
      "Body is missing"
    );
  }

  const { fullName, username, email, password } = req.body;

  if (!(fullName && username && email && password)) {
    throw new ApiError(
      400,
      { message: "Any field is missing" },
      "Some field is missing"
    );
  }

  if (!email.includes("@")) {
    throw new ApiError(
      400,
      { message: "Email is not valid" },
      "Provided email is not valid"
    );
  }

  const checkUser = await User.findOne({
    $or: [{ email }, { password }],
  });

  if (checkUser) {
    throw new ApiResponse(400, checkUser, "User already exist plese login");
  }

  const otp = await nodeMailer(email);

  const data = {
    fullName,
    username,
    email,
    password: await passwordHashing(password),
    otp,
  };
  let user = await User.create(data);

  if (!user) {
    throw new ApiError(
      400,
      "Unable to create the user",
      "Unable to create the User"
    );
  }

  const userWithoutPassword = user.toObject({ getters: true, virtuals: false });

  delete userWithoutPassword.password;

  user = userWithoutPassword;

  res
    .status(200)
    .json(new ApiResponse(200, user, "User is successfully registered"));
};

const verifyOtp = async (req, res) => {
  if (!req.body) {
    throw new Error("Body is empty");
  }

  const { email, otp } = req.body;

  if (!email.includes("@")) {
    throw new Error("invalid email address");
  }

  let user = await User.findOne({ email });

  if (!user) {
    throw new Error("User does not registered successfully");
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Please enter a correct otp" });
  }

  const userWithoutPassword = user.toObject({ getters: true, virtuals: false });

  delete userWithoutPassword.password;

  user = userWithoutPassword;

  res
    .status(200)
    .json(new ApiResponse(200, user, "User is verified succuessfully"));
};

const loginUser = async (req, res) => {
  if (!req.body) {
    return res.status(401).json({ message: "Body is empty" });
  }

  const { email, password } = req.body;

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Inavalid email address" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return res.status(400).json({ message: "Entered password is incorrect" });
  }

  const otp = await nodeMailer(email);

  user.otp = otp;

  user = await User.findOneAndUpdate(
    { email },
    { $set: { otp: user.otp } },
    { returnDocument: "after" }
  );

  res.status(200).json(new ApiResponse(200, user, "Successfully logged in"));
};

const forgotPassword = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Empty body is send" });
  }

  const { email } = req.body;

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Email address does not exist" });
  }

  const otp = await nodeMailer(email);

  user = await User.findOneAndUpdate(
    { email },
    { $set: { otp } },
    { returnDocument: "after" }
  );

  const userWithoutPassword = user.toObject({ getters: true, virtuals: false });
  delete userWithoutPassword.password;

  user = userWithoutPassword;

  res
    .status(200)
    .json(new ApiResponse(200, user, "Otp is sent please enter that "));
};

const newPassword = async (req, res) => {
  if (!req.body) {
    return req.status(400).json({ message: "Body is missing" });
  }

  const { email, password, confirmedPassword } = req.body;

  if (!(email && password && confirmedPassword)) {
    return res.status(400).json({ message: "Some fields are empty" });
  }

  if (password !== confirmedPassword) {
    return res.status(400).json({ message: "Password Mismatched" });
  }

  let user = await User.findOneAndUpdate(
    { email },
    { $set: { password: await passwordHashing(password) } },
    { returnDocument: "after" }
  );

  const userWithoutPassword = user.toObject({ getters: true, virtuals: false });
  delete userWithoutPassword.password;

  user = userWithoutPassword;

  res
    .status(200)
    .json(new ApiResponse(200, user, "Password has changed successfully"));
};

const editProfile = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "The body is empty" });
    }

    const { _id, location, website, bio, fullName } = req.body;

    if (!(fullName && location && bio)) {
      res.status(400).json({ message: "Some fields are empty" });
    }

    const profilePicturePath = req.files?.profilePicture[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;

    if (profilePicturePath === undefined) {
      res.status(400).json({ message: "profilePicture is missing" });
    }

    const profilePicture = await uploadOnCloudinary(profilePicturePath);
    const coverImage = await uploadOnCloudinary(coverImagePath);

  
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          fullName,
          profilePicture: profilePicture.url,
          coverImage: coverImage.url,
          bio,
          website,
          location,
        },
      },
      {
        new: true,
      }
    ).select('-password')

    res
      .status(200)
      .json(new ApiResponse(200, user, "Profile updated successfully"));
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};


const profileData = async (req, res) => {
  try {
    const {_id} = req.body

    const user = await User.findById(_id).select('-password -otp -updatedAt -email ')

    if(!user) {
      res.status(404).json(new ApiResponse(404, null, 'Unable to fetch the data'))
    }

    return res.status(200).json(new ApiResponse(200, user, 'Fetch successfully data of user'))

  }catch (error) {
    console.log(error)

    res.status(400).json(error)
  }

}

export {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  newPassword,
  editProfile,
  profileData
};
