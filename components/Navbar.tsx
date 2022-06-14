const Navbar = () => {
  return (
    <div className="fixed z-20 w-full px-4 bg-green-600 shadow-lg navbar text-neutral-content">
      <div className="flex-none">Logo</div>
      <div className="flex-1 px-2 mx-2">
        <span className="text-lg font-bold">With two icons</span>
      </div>

      <div className="flex-none">
        {/* XXX: Drawer opener if ever to be used */}
        {/* <div className="flex flex-col items-center justify-center drawer-content">
          <label htmlFor="sidebar" className="btn btn-primary drawer-button">
            open menu
          </label>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
