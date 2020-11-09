export default async (app, user) => {
  const response = await app.inject({
    method: 'POST',
    url: '/login',
    payload: {
      email: user.email,
      password: user.password,
    },
  });
  const [sessionCookies] = response.cookies;
  return { session: sessionCookies.value };
};
