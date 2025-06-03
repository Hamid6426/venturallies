import { useEffect, useState } from 'react';

export default function UserAccountMenu() {
//   const [user, setUser] = useState<any>(null);
//   const [balance, setBalance] = useState<number>(0);

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch('/api/auth/session');
//       const data = await res.json();
//       if (data.user) {
//         setUser(data.user);

//         const stats = await fetch(`/api/statements/${data.user.id}`).then(res => res.json());
//         const { deposit, withdrawal, investment } = stats;
//         setBalance(deposit - withdrawal - investment);
//       }
//     }
//     fetchData();
//   }, []);

  // if (!user) {
  //   return <a href="/login" className="text-sm text-blue-600 hover:underline">Login</a>;
  // }

  return (
    <div className="relative group">
      <button className="flex items-center text-sm space-x-2">
        {/* <span>{user.name}</span> */}
        <span>Hamid</span>
        {/* <strong className="text-green-600">€{balance.toFixed(2)}</strong> */}
      </button>
      <div className="absolute bg-white rounded shadow mt-2 p-2 hidden group-hover:block">
        <a href="/account-overview" className="block px-4 py-2 hover:bg-gray-100">Overview</a>
        <a href="/account-investments" className="block px-4 py-2 hover:bg-gray-100">Investments</a>
        <a href="/account-statement" className="block px-4 py-2 hover:bg-gray-100">Statement</a>
        <a href="/account-funding" className="block px-4 py-2 hover:bg-gray-100">Funding</a>
        <a href="/account-profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
        <a href="/logout" className="block px-4 py-2 text-red-500 hover:bg-gray-100">Logout</a>
      </div>
    </div>
  );
}
