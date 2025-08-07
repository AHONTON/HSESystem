import React from 'react'
import { motion } from 'framer-motion'
import Card from '../UI/Card'

const InterfaceDemo = () => {
  const screenshots = [
    {
      title: "Dashboard Principal",
      description: "Vue d'ensemble avec KPIs, graphiques et activités récentes",
      image: "/images/dashboard-overview.png",
      features: [
        "KPIs en temps réel",
        "Graphiques interactifs", 
        "Activités récentes",
        "Actions rapides"
      ]
    },
    {
      title: "Interface de Connexion",
      description: "Connexion sécurisée avec comptes de test",
      image: "/images/login-interface.png",
      features: [
        "Design moderne",
        "Authentification sécurisée",
        "Comptes de démonstration",
        "Mode sombre/clair"
      ]
    },
    {
      title: "Navigation Latérale",
      description: "Menu de navigation collapsible et intuitif",
      image: "/images/sidebar-navigation.png",
      features: [
        "Navigation collapsible",
        "Indicateurs visuels",
        "Organisation logique",
        "Responsive design"
      ]
    },
    {
      title: "Gestion des Incidents",
      description: "Interface complète pour le suivi des incidents HSE",
      image: "/images/incidents-management.png",
      features: [
        "Cartes d'incidents",
        "Filtrage avancé",
        "Badges de statut",
        "Actions contextuelles"
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Interface HSE Tracking App
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Aperçu des principales interfaces de l'application de suivi HSE
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {screenshots.map((screenshot, index) => (
          <motion.div
            key={screenshot.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg aspect-video bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700">
                  <img
                    src={screenshot.image || "/placeholder.svg"}
                    alt={screenshot.title}
                    className="object-cover w-full h-full rounded-lg shadow-inner"
                  />
                </div>
                
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {screenshot.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {screenshot.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fonctionnalités principales:
                    </h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {screenshot.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mt-8">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Fonctionnalités Complètes
          </h2>
          <div className="grid grid-cols-2 gap-6 mt-6 md:grid-cols-4">
            {[
              { icon: "📊", title: "Dashboard", desc: "KPIs et statistiques" },
              { icon: "👥", title: "Utilisateurs", desc: "Gestion des comptes" },
              { icon: "🦺", title: "EPI", desc: "Suivi des équipements" },
              { icon: "⚠️", title: "Incidents", desc: "Déclaration et suivi" },
              { icon: "📈", title: "Statistiques", desc: "Analyses avancées" },
              { icon: "📄", title: "Rapports", desc: "Génération PDF/CSV" },
              { icon: "🎓", title: "Formations", desc: "Gestion des formations" },
              { icon: "🌙", title: "Mode Sombre", desc: "Interface adaptative" }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                className="p-4 text-center rounded-lg bg-gray-50 dark:bg-gray-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="mb-2 text-3xl">{feature.icon}</div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200">
            Technologies Utilisées
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React", "Vite", "TailwindCSS", "Framer Motion", 
              "React Router", "Recharts", "SweetAlert2", "Lucide Icons"
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default InterfaceDemo