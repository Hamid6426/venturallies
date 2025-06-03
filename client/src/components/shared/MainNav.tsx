export default function MainNav() {
  return (
    <nav className="hidden md:flex space-x-6 text-sm">
      <a href="/projects" className="hover:text-blue-600">Invest</a>
      <div className="group relative">
        <a href="/about" className="hover:text-blue-600">About</a>
        <div className="absolute hidden group-hover:block bg-white shadow p-2 mt-2 space-y-1">
          <a href="/about" className="block px-4 py-2 hover:bg-gray-100">About Us</a>
          <a href="/careers" className="block px-4 py-2 hover:bg-gray-100">Careers</a>
          <a href="/statistics" className="block px-4 py-2 hover:bg-gray-100">Statistics</a>
          <a href="/affiliate" className="block px-4 py-2 hover:bg-gray-100">Affiliate</a>
        </div>
      </div>
      <a href="/news" className="hover:text-blue-600">News</a>
      <a href="/styleguide" className="hover:text-blue-600">Styleguide</a>
      <div className="group relative">
        <a href="/help" className="hover:text-blue-600">Help</a>
        <div className="absolute hidden group-hover:block bg-white shadow p-2 mt-2 space-y-1">
          <a href="/help" className="block px-4 py-2 hover:bg-gray-100">Support</a>
          <a href="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</a>
        </div>
      </div>
    </nav>
  );
}
