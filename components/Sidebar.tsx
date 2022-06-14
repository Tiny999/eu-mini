import Link from "next/link";

const Sidebar = () => {
  return (
    <ul className="px-4 pt-20 overflow-y-auto bg-blue-500 menu w-52">
      <li>
        <Link href="/">
          <a>Index</a>
        </Link>
      </li>
      <li>
        <Link href="/home">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/deep">
          <a>DeepAR</a>
        </Link>
      </li>
      <li>
        <Link href="/three">
          <a>THREE</a>
        </Link>
      </li>
    </ul>
  );
};

export default Sidebar;
