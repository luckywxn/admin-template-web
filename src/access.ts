/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log('currentUser.memus',currentUser && currentUser.memus);
  return currentUser && currentUser.memus;
  // return {
  //   canAdmin: currentUser && currentUser.access === 'admin',
  // };
}
