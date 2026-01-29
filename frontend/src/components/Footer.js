import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Creative Stock</h3>
            <p className="text-gray-600 text-sm">
              A visual discovery platform for creative inspiration.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><button type="button" className="hover:text-red-600 text-left">About</button></li>
              <li><button type="button" className="hover:text-red-600 text-left">Careers</button></li>
              <li><button type="button" className="hover:text-red-600 text-left">Blog</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><button type="button" className="hover:text-red-600 text-left">Help Center</button></li>
              <li><button type="button" className="hover:text-red-600 text-left">Contact Us</button></li>
              <li><button type="button" className="hover:text-red-600 text-left">Privacy Policy</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><button type="button" className="hover:text-red-600 text-left">Terms of Service</button></li>
              <li><button type="button" className="hover:text-red-600 text-left">Cookie Policy</button></li>
              <li><button type="button" className="hover:text-red-600 text-left">Community Guidelines</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 Creative Stock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;