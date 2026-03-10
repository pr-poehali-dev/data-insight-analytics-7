import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

const tools = [
  {
    id: 'username',
    label: 'Поиск по нику',
    icon: 'User',
    placeholder: 'Введите username...',
    description: 'Поиск аккаунтов по нику в соцсетях',
    getLinks: (q: string) => [
      { name: 'Sherlock (GitHub)', url: `https://github.com/sherlock-project/sherlock` },
      { name: 'WhatsMyName', url: `https://whatsmyname.app/?q=${encodeURIComponent(q)}` },
      { name: 'Namechk', url: `https://namechk.com/` },
      { name: 'ВКонтакте', url: `https://vk.com/search?q=${encodeURIComponent(q)}&section=people` },
    ]
  },
  {
    id: 'email',
    label: 'Проверка email',
    icon: 'Mail',
    placeholder: 'example@mail.com',
    description: 'Поиск утечек и регистраций по email',
    getLinks: (q: string) => [
      { name: 'Have I Been Pwned', url: `https://haveibeenpwned.com/account/${encodeURIComponent(q)}` },
      { name: 'Hunter.io', url: `https://hunter.io/email-verifier/${encodeURIComponent(q)}` },
      { name: 'Epieos', url: `https://epieos.com/?q=${encodeURIComponent(q)}&t=email` },
      { name: 'Google поиск', url: `https://www.google.com/search?q="${encodeURIComponent(q)}"` },
    ]
  },
  {
    id: 'phone',
    label: 'Поиск по телефону',
    icon: 'Phone',
    placeholder: '+7 (999) 000-00-00',
    description: 'Проверка номера телефона по открытым базам',
    getLinks: (q: string) => [
      { name: 'GetContact Web', url: `https://getcontact.com/` },
      { name: 'NumVerify', url: `https://numverify.com/` },
      { name: 'Глаз Бога (TG)', url: `https://t.me/GlazBogaBot` },
      { name: 'Google поиск', url: `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    ]
  },
  {
    id: 'photo',
    label: 'Поиск по фото',
    icon: 'Camera',
    placeholder: 'Вставьте ссылку на фото...',
    description: 'Обратный поиск изображения / лица',
    getLinks: (q: string) => [
      { name: 'Google Images', url: `https://images.google.com/searchbyimage?image_url=${encodeURIComponent(q)}` },
      { name: 'Yandex Images', url: `https://yandex.ru/images/search?rpt=imageview&url=${encodeURIComponent(q)}` },
      { name: 'TinEye', url: `https://tineye.com/search?url=${encodeURIComponent(q)}` },
      { name: 'PimEyes', url: `https://pimeyes.com/en` },
    ]
  },
  {
    id: 'company',
    label: 'Проверка ИНН / юрлица',
    icon: 'Building2',
    placeholder: 'ИНН или название компании...',
    description: 'Проверка юридических лиц и ИП по открытым реестрам',
    getLinks: (q: string) => [
      { name: 'ЕГРЮЛ (ФНС)', url: `https://egrul.nalog.ru/index.html?query=${encodeURIComponent(q)}` },
      { name: 'Rusprofile', url: `https://www.rusprofile.ru/search?query=${encodeURIComponent(q)}` },
      { name: 'СБИС', url: `https://sbis.ru/contragents?search=${encodeURIComponent(q)}` },
      { name: 'Контур.Фокус', url: `https://focus.kontur.ru/search?query=${encodeURIComponent(q)}` },
    ]
  },
]

interface OsintToolsSectionProps {
  isActive: boolean
}

export default function OsintToolsSection({ isActive }: OsintToolsSectionProps) {
  const [activeTool, setActiveTool] = useState(0)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; url: string }[] | null>(null)

  const handleSearch = () => {
    if (!query.trim()) return
    setResults(tools[activeTool].getLinks(query.trim()))
  }

  const handleToolChange = (index: number) => {
    setActiveTool(index)
    setQuery('')
    setResults(null)
  }

  return (
    <section className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[#4A9EFF] text-sm font-mono uppercase tracking-widest mb-3">Инструменты</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-8">
          OSINT самостоятельно
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {tools.map((tool, index) => (
          <button
            key={tool.id}
            onClick={() => handleToolChange(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeTool === index
                ? 'bg-[#4A9EFF] border-[#4A9EFF] text-black'
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
            }`}
          >
            <Icon name={tool.icon} size={14} />
            {tool.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="max-w-2xl"
      >
        <p className="text-white/40 text-sm mb-3">{tools[activeTool].description}</p>
        <div className="flex gap-3">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={tools[activeTool].placeholder}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-[#4A9EFF] focus-visible:ring-0"
          />
          <Button
            onClick={handleSearch}
            className="bg-[#4A9EFF] hover:bg-[#3a8eef] text-black font-semibold px-6 shrink-0"
          >
            <Icon name="Search" size={16} />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              key={tools[activeTool].id + query}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5 grid grid-cols-2 gap-2"
            >
              {results.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-[#4A9EFF]/10 hover:border-[#4A9EFF]/40 text-white text-sm transition-all group"
                >
                  <Icon name="ExternalLink" size={13} className="text-[#4A9EFF] shrink-0" />
                  <span className="truncate group-hover:text-[#4A9EFF] transition-colors">{link.name}</span>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}