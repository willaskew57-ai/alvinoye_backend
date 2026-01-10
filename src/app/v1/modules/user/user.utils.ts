
import User from './user.model';

export const findLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?._id ? lastStudent?._id : undefined;
};


const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1 }).sort({
    createdAt: -1,
  });

  return lastAdmin?.id.substring(2);
};

export const generateAdminId = async () => {
  const adminId = await findLastAdminId();
  let currentId = (0).toString();
  if (adminId) {
    currentId = adminId;
  }

  const newId = 'A-' + (Number(currentId) + 1).toString().padStart(4, '0');
  return newId;
};
