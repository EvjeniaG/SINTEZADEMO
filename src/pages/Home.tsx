import React from 'react'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { Link } from 'react-router-dom'

// Importojmë animacionin Lottie për rrezet diellore
const solarAnimation = 'https://assets2.lottiefiles.com/packages/lf20_xlmz9xwm.json'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-gray-50">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-sinteza-yellow opacity-10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-sinteza-blue opacity-10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.1, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0.9)_100%)] z-0" />

        {/* Lottie Animation në background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Player
            autoplay
            loop
            src={solarAnimation}
            style={{ height: '100%', width: '100%' }}
          />
        </div>

        <motion.div 
          className="container mx-auto px-4 text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-sinteza-blue via-sinteza-green to-sinteza-yellow bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              SINTEZA
            </motion.h1>
          </motion.div>

          <motion.div className="space-y-2 mb-8">
            <motion.p 
              className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-light relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="relative">
                <span className="absolute -inset-1 bg-gradient-to-r from-sinteza-blue/10 via-sinteza-green/10 to-sinteza-yellow/10 blur"></span>
                <span className="relative">Platforma që bashkon edukimin</span>
              </span>
            </motion.p>

            <motion.p
              className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-sinteza-yellow via-sinteza-green to-sinteza-blue bg-clip-text text-transparent">
                me inteligjencën diellore ☀️
              </span>
            </motion.p>
          </motion.div>

        

          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/dashboard" 
              className="relative group"
            >
              <span className="btn-primary shadow-lg shadow-sinteza-green/20 hover:shadow-xl hover:-translate-y-1 transform transition-all inline-flex items-center gap-2">
                Shiko Dashboardin
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-sinteza-green/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity rounded-lg"></div>
            </Link>

            <Link 
              to="/edukimi" 
              className="relative group"
            >
              <span className="btn-secondary shadow-lg shadow-sinteza-yellow/20 hover:shadow-xl hover:-translate-y-1 transform transition-all inline-flex items-center gap-2">
                Edukimi
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-sinteza-yellow/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity rounded-lg"></div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator with better animation */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          onClick={() => {
            const nextSection = document.getElementById('what-is-sinteza');
            nextSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center relative">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 whitespace-nowrap">
              Zbulo më shumë
            </span>
          </div>
        </motion.div>
      </section>

      {/* Çfarë është SINTEZA? Section */}
      <section id="what-is-sinteza" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-sinteza-blue opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sinteza-green opacity-5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-20 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sinteza-blue via-sinteza-green to-sinteza-yellow bg-clip-text text-transparent">
              Çfarë është SINTEZA?
            </h2>
            <p className="text-gray-600 text-lg">
              Një platformë inovative që kombinon teknologjinë diellore me edukimin modern për një të ardhme më të qëndrueshme.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* First row - 4 cards */}
              <div className="col-span-2 md:col-span-3 lg:col-span-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    {
                      letter: 'S',
                      title: 'Solar',
                      description: 'Energjia e diellit në shërbim të shkollës',
                      gradient: 'from-yellow-400 via-orange-400 to-yellow-500',
                      lightGradient: 'from-yellow-50 to-orange-50',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )
                    },
                    {
                      letter: 'I',
                      title: 'Inovacion',
                      description: 'Teknologji inovative për monitorim dhe vizualizim',
                      gradient: 'from-blue-400 via-indigo-400 to-blue-500',
                      lightGradient: 'from-blue-50 to-indigo-50',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )
                    },
                    {
                      letter: 'N',
                      title: 'Ndërveprim',
                      description: 'Bashkëpunim mes nxënësve të shkollës',
                      gradient: 'from-emerald-400 via-green-400 to-emerald-500',
                      lightGradient: 'from-emerald-50 to-green-50',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )
                    },
                    {
                      letter: 'T',
                      title: 'Teknologji',
                      description: 'Zgjidhje moderne teknologjike',
                      gradient: 'from-red-400 via-rose-400 to-red-500',
                      lightGradient: 'from-red-50 to-rose-50',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )
                    }
                  ].map((item, index) => (
                    <CardComponent key={item.letter} item={item} index={index} />
                  ))}
                </div>
              </div>

              {/* Second row - 3 cards centered */}
              <div className="col-span-2 md:col-span-3 lg:col-span-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
                  {[
                    {
                      letter: 'E',
                      title: 'Edukim',
                      description: 'Materiale edukative interaktive',
                      gradient: 'from-purple-400 via-violet-400 to-purple-500',
                      lightGradient: 'from-purple-50 to-violet-50',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )
                    },
                    {
                      letter: 'Z',
                      title: 'Zhvillim',
                      description: 'Zhvillim i qëndrueshëm mjedisor',
                      gradient: 'from-teal-400 via-cyan-400 to-teal-500',
                      lightGradient: 'from-teal-50 to-cyan-50',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )
                    },
                    {
                      letter: 'A',
                      title: 'Automatizim',
                      description: 'Sisteme të automatizuara smart',
                      gradient: 'from-sinteza-blue via-blue-400 to-sinteza-blue',
                      lightGradient: 'from-blue-50 to-sky-50',
                      icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      )
                    }
                  ].map((item, index) => (
                    <CardComponent key={item.letter} item={item} index={index + 4} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shkolla jonë Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sinteza-blue to-sinteza-green bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Shkolla Inteligjente në Shqipëri
                </motion.h2>
                <div className="prose prose-lg">
                  <p className="text-gray-600 leading-relaxed">
                    Shkolla Profesionale Teknike Korçë është shkolla e parë pioniere në zbatimin e projektit të Shkollës Diellore Inteligjente në Shqipëri. Me një histori të pasur në arsimin profesional, shkolla jonë po hap rrugën drejt një të ardhmeje të qëndrueshme.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Projekti ynë i energjisë diellore nuk është thjesht një instalim panelesh - është një laborator i gjallë për nxënësit tanë, një mundësi për të mësuar në praktikë, dhe një hap drejt një të ardhmeje më të gjelbër.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div 
                    className="flex items-center space-x-2 text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sinteza-blue to-blue-400 flex items-center justify-center text-white font-bold">
                      1st
                    </div>
                    <span>Shkollë<br/>Inteligjente</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-2 text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sinteza-green to-green-400 flex items-center justify-center text-white font-bold">
                      +3st
                    </div>
                    <span>Shkolla Diellore<br/>në Shqipëri</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-2 text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
                      100%
                    </div>
                    <span>Energji e<br/>Rinovueshme</span>
                  </motion.div>
                </div>
              </div>

              {/* Image/Visual Side */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-sinteza-blue/20 to-transparent"></div>
                  <img 
                    src="public\shkolla-profesionale-korce.jpeg" 
                    alt="Shkolla Profesionale Teknike Korçë" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                    <h3 className="text-white font-bold text-xl">Shkolla Profesionale Teknike Korçë</h3>
                    <p className="text-white/80">Korçë, Shqipëri</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-sinteza-blue to-blue-400 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-sinteza-green to-green-400 rounded-full opacity-20 blur-2xl"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Çfarë mund të bësh në platformë? Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-sinteza-green to-sinteza-blue bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Çfarë mund të bësh në platformë?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Monitoro',
                description: 'Ndiq në kohë reale prodhimin e energjisë diellore në shkollën tënde',
                icon: '📊',
                gradient: 'from-sinteza-blue to-blue-400'
              },
              {
                title: 'Mëso',
                description: 'Eksploro kurse interaktive për energjinë e rinovueshme',
                icon: '📚',
                gradient: 'from-sinteza-green to-green-400'
              },
              {
                title: 'Bashkëvepro',
                description: 'Diskuto dhe ndaj eksperienca me nxënës të tjerë në forum',
                icon: '🤝',
                gradient: 'from-sinteza-yellow to-yellow-400'
              }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                className="glass-card p-6 text-center group hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                whileHover={{ scale: 1.02, rotateZ: 1 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <motion.div 
                  className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-sinteza-blue to-sinteza-green bg-clip-text text-transparent">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const CardComponent = ({ item, index }) => (
  <motion.div
    className={`bg-gradient-to-br ${item.lightGradient} rounded-xl p-4 group hover:shadow-lg transition-all duration-500 relative overflow-hidden`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    {/* Top Decoration */}
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-10 rounded-full blur-xl transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500`}></div>
    
    {/* Header with Icon and Letter */}
    <div className="flex items-center gap-3 mb-2">
      {/* Icon in small circle */}
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} bg-opacity-10 flex items-center justify-center text-transparent bg-clip-text`}>
        {item.icon}
      </div>
      
      {/* Letter and Title */}
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent`}>
          {item.letter}
        </span>
        <h3 className={`text-base font-semibold bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent`}>
          {item.title}
        </h3>
      </div>
    </div>

    {/* Description */}
    <p className="text-sm text-gray-600 leading-relaxed">
      {item.description}
    </p>

    {/* Bottom Decoration */}
    <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br ${item.gradient} opacity-10 rounded-full blur-xl transform -translate-x-4 translate-y-4 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-500`}></div>
  </motion.div>
);

export default Home 