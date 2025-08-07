import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  HardHat,
  Package,
  AlertTriangle,
  FileText,
  BarChart3,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LifeBuoy,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/users", icon: Users, label: "Utilisateurs" },
    { path: "/technicians", icon: HardHat, label: "Techniciens & EPI" },
    { path: "/epi-stock", icon: Package, label: "Stock EPI" },
    { path: "/incidents", icon: AlertTriangle, label: "Incidents & Activités" },
    { path: "/reports", icon: FileText, label: "Rapports" },
    { path: "/statistics", icon: BarChart3, label: "Statistiques" },
    { path: "/training", icon: GraduationCap, label: "Formations" },

    // ➕ Nouveaux menus
    { path: "/support", icon: LifeBuoy, label: "Support" },
    { path: "/help", icon: HelpCircle, label: "Aide" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
  ];

  const sidebarVariants = {
    expanded: { width: "16rem", transition: { duration: 0.3 } },
    collapsed: { width: "5rem", transition: { duration: 0.3 } },
  };

  const textVariants = {
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.aside
      className="flex flex-col justify-between h-screen border-r border-gray-700 shadow-xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      initial="expanded"
    >
      <div className="flex flex-col h-full">
        {/* 🔰 Logo + Toggle */}
        <div className="flex items-center justify-between px-3 pt-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-green-400" />
            {!collapsed && (
              <motion.span
                className="text-lg font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                BIOS PARTNERSHIP
              </motion.span>
            )}
          </div>
          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 transition rounded-lg hover:bg-gray-700/50 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* 🧭 Navigation */}
        <nav className="flex-1 px-3 mt-6 overflow-y-auto">
          <ul className="space-y-3">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link to={item.path}>
                    <motion.div
                      className={`flex items-center gap-4 px-3 py-2 rounded-lg group cursor-pointer transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white"
                          : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Icon className="w-5 h-5 text-green-400" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="text-sm font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* 🚪 Déconnexion */}
        <div className="p-3 border-t border-gray-700">
          <motion.button
            onClick={handleLogout}
            className="flex items-center w-full gap-4 px-3 py-2 text-red-400 transition rounded-lg hover:bg-red-500/10 hover:text-red-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="text-sm font-medium"
                >
                  Déconnecter
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
