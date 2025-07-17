import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const contactLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Nexonikk",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yusufhameed911",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:yusufhameed911@gmail.com",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <>
      <footer className="animated-footer dark:bg-black bg-white">
        <div className="footer-content max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col items-center space-y-4"
          >
            <h3 className="text-3xl font-bold text-black dark:text-white">
              Formzupp
            </h3>
            <p className="dark:text-gray-400 text-gray-800 text-base max-w-md">
              The intelligent way to build beautiful, conversational forms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center space-x-6"
          >
            {contactLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-gray-400 text-gray-800 hover:text-emerald-400 transition-colors duration-300"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </motion.div>

          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row-reverse items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-700">
              <span>Built by Yusuf Hameed</span>
            </div>
            <div className="flex space-x-4 text-sm dark:text-gray-400 text-gray-600 ">
              <p>&copy; {new Date().getFullYear()} Formzupp</p>
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
