import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-black py-8 border-t-4 border-retro-purple">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-pixel text-retro-yellow text-lg mb-4">DEFENSE-O-RAMA</h3>
            <p className="font-retro text-retro-light text-sm">
              A satirical platform for defending fictional characters and public figures against absurd accusations. For entertainment purposes only!
            </p>
          </div>
          
          <div>
            <h3 className="font-pixel text-retro-pink text-lg mb-4">LINKS</h3>
            <ul className="space-y-2 font-retro text-retro-light">
              <li><Link href="/"><div className="hover:text-retro-yellow cursor-pointer">Home</div></Link></li>
              <li><Link href="/trials"><div className="hover:text-retro-yellow cursor-pointer">Trials</div></Link></li>
              <li><Link href="/hall-of-plain"><div className="hover:text-retro-yellow cursor-pointer">Hall of Plain</div></Link></li>
              <li><Link href="/leaderboard"><div className="hover:text-retro-yellow cursor-pointer">Leaderboard</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-pixel text-retro-green text-lg mb-4">LEGAL STUFF</h3>
            <ul className="space-y-2 font-retro text-retro-light">
              <li><a href="#" className="hover:text-retro-yellow">Terms of Service</a></li>
              <li><a href="#" className="hover:text-retro-yellow">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-retro-yellow">Content Guidelines</a></li>
              <li><a href="#" className="hover:text-retro-yellow">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-pixel text-retro-blue text-lg mb-4">CONNECT</h3>
            <div className="flex space-x-4 mb-4">
              <motion.a 
                href="#" 
                className="text-retro-light hover:text-retro-yellow text-xl"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <i className="fab fa-twitter"></i>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-retro-light hover:text-retro-yellow text-xl"
                whileHover={{ scale: 1.2, rotate: -5 }}
              >
                <i className="fab fa-instagram"></i>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-retro-light hover:text-retro-yellow text-xl"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <i className="fab fa-discord"></i>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-retro-light hover:text-retro-yellow text-xl"
                whileHover={{ scale: 1.2, rotate: -5 }}
              >
                <i className="fab fa-reddit"></i>
              </motion.a>
            </div>
            
            <div>
              <h4 className="font-retro text-retro-light mb-2">JOIN OUR NEWSLETTER</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-retro-dark px-3 py-2 rounded-l font-retro text-retro-light w-full"
                />
                <button className="bg-retro-orange px-3 py-2 rounded-r font-pixel text-white">GO</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-retro-purple mt-8 pt-6 text-center">
          <p className="font-retro text-retro-light text-sm">
            © {new Date().getFullYear()} Defense-O-Rama. All rights unreserved because this is satirical. Made with <span className="text-retro-pink">❤</span> and sarcasm.
          </p>
        </div>
      </div>
    </footer>
  );
}
