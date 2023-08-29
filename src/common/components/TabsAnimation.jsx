import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TabsAnimation({ children }) {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          // key={selectedTab ? selectedTab.label : "empty"}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
