import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-gray-600">
      
      
      <div className="bg-white py-8">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
          
          
          <div className="mb-6 relative w-32 h-10 md:w-40 md:h-12">
            <Link href='/'>
            
              <Image 
                src="/images/logo.png" 
                alt="Meiden T&D India Logo"

                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center space-x-6 mb-3">
            <Link 
              href="/privacy-policy" 
              className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
            >
              Privacy Policy
            </Link>
            
            <span className="text-gray-300">|</span>
            
            <Link 
              href="/terms" 
              className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
            >
              Terms of Use
            </Link>
          </div>

          <div>
            <a 
              href="https://www.meidensha.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors"
            >
              MEIDENSHA CORPORATION
            </a>
          </div>

        </div>
      </div>

     
      <div className="bg-brand-secondary py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-white tracking-wide">
            Copyright &copy; MEIDEN T&D (INDIA) LIMITED All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}