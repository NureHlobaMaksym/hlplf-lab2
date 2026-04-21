export const userFullName = (user) => {
  const firstName = (user?.firstName || '').trim();
  const lastName = (user?.lastName || '').trim();
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || 'Користувач';
};
