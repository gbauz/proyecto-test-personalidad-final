const Footer = () => {
    return (
      <footer className="bg-black text-gray-400 rounded-lg shadow-sm m-4">
        <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col md:flex-row items-center justify-between">
          <span className="text-sm text-center">
            © 2023 <a href="https://flowbite.com/" className="hover:underline text-white">Flowbite™</a>. All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">About</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  