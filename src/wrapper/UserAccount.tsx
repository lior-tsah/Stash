import "./Wrapper.css";

interface UserAccountProps {
  isButton?: boolean;
}
const UserAccount = ({ isButton = true }: UserAccountProps) => {

  const element = (
    <div className="user-account">
      <label className="user-account-label">
        U
      </label>
    </div>
  );

  // useEffect(() => {
  //   if (!isButton) return;
  //   const interval = setInterval(() => {
  //     switchUser(user.name, user.password);
  //   }, 600000); // 600000ms = 10 minutes

  //   return () => clearInterval(interval);
  // }, [user, isButton]);

  // const switchUser = async (userName: string, password = "") => {
  //   try {
  //     const res = await login(userName, password);

  //     // dispatch(setUser({ name: userName, password: password }));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const addLeadingZero = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  // const options = [];
  // for (let i = 1; i <= 20; i++) {
  //   options.push({
  //     name: `U${addLeadingZero(i)}`,
  //     onPress: () => switchUser(`U${addLeadingZero(i)}`, "na"),
  //   });
  // }
  // for (let i = 1; i <= 5; i++) {
  //   for (let j = 1; j <= 10; j++) {
  //     options.push({
  //       name: `U${i}N${j}`,
  //       onPress: () => switchUser(`U${i}N${j}`, "nopassword01!"),
  //     });
  //   }
  // }

  // const btn: FilterButton = {
  //   name: "User Account",
  //   src: AccountCircle,
  //   options: options,
  //   element: element,
  // };

  // return isButton ? (
  //   <DropdownButton
  //     btn={btn}
  //     containerClassName="user-account-container"
  //     anchorHeight
  //   />
  // ) :
  return <>{element}</>;
};
export default UserAccount;
