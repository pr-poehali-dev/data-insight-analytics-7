import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

const PHONE_URL = 'https://functions.poehali.dev/c356e495-b842-4b1b-a2f2-bc2521158ef6'
const INN_URL = 'https://functions.poehali.dev/8c588528-d268-4ecc-bba3-8965930394dd'

const tools = [
  {
    id: 'phone',
    label: 'Телефон',
    icon: 'Phone',
    placeholder: '+7 (999) 000-00-00',
    description: 'Оператор, регион и страна по номеру телефона',
    type: 'api',
    apiUrl: PHONE_URL,
  },
  {
    id: 'inn',
    label: 'ИНН / Компания',
    icon: 'Building2',
    placeholder: 'ИНН или название компании...',
    description: 'Юридическая информация: статус, адрес, директор, ОКВЭД',
    type: 'api',
    apiUrl: INN_URL,
  },
  {
    id: 'username',
    label: 'Ник / Username',
    icon: 'User',
    placeholder: 'Введите username...',
    description: 'Открытые ресурсы для поиска аккаунтов по нику',
    type: 'links',
    getLinks: (q: string) => [
      { name: 'WhatsMyName', url: `https://whatsmyname.app/?q=${encodeURIComponent(q)}` },
      { name: 'Namechk', url: `https://namechk.com/` },
      { name: 'ВКонтакте', url: `https://vk.com/search?q=${encodeURIComponent(q)}&section=people` },
      { name: 'Sherlock Project', url: `https://github.com/sherlock-project/sherlock` },
    ]
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'Mail',
    placeholder: 'example@mail.com',
    description: 'Проверка email по базам утечек и открытым ресурсам',
    type: 'links',
    getLinks: (q: string) => [
      { name: 'Have I Been Pwned', url: `https://haveibeenpwned.com/account/${encodeURIComponent(q)}` },
      { name: 'Epieos', url: `https://epieos.com/?q=${encodeURIComponent(q)}&t=email` },
      { name: 'Hunter.io', url: `https://hunter.io/email-verifier/${encodeURIComponent(q)}` },
      { name: 'Google поиск', url: `https://www.google.com/search?q="${encodeURIComponent(q)}"` },
    ]
  },
  {
    id: 'photo',
    label: 'Фото',
    icon: 'Camera',
    placeholder: 'Ссылка на фото...',
    description: 'Обратный поиск изображения или лица',
    type: 'links',
    getLinks: (q: string) => [
      { name: 'Google Images', url: `https://images.google.com/searchbyimage?image_url=${encodeURIComponent(q)}` },
      { name: 'Yandex Images', url: `https://yandex.ru/images/search?rpt=imageview&url=${encodeURIComponent(q)}` },
      { name: 'TinEye', url: `https://tineye.com/search?url=${encodeURIComponent(q)}` },
      { name: 'PimEyes', url: `https://pimeyes.com/en` },
    ]
  },
]

interface PhoneResult {
  phone: string
  type?: string
  carrier?: string
  region?: string
  city?: string
  country?: string
  timezone?: string
  qc?: number
}

interface InnResult {
  name?: string
  inn?: string
  ogrn?: string
  kpp?: string
  status?: string
  type?: string
  address?: string
  director?: string
  director_post?: string
  okved?: string
}

interface OsintToolsSectionProps {
  isActive: boolean
}

const phoneTypeMap: Record<string, string> = {
  'Mobile': 'Мобильный',
  'Landline': 'Стационарный',
  'Premium': 'Платный',
}

const statusMap: Record<string, string> = {
  'ACTIVE': 'Действует',
  'LIQUIDATING': 'Ликвидируется',
  'LIQUIDATED': 'Ликвидирована',
  'BANKRUPT': 'Банкрот',
  'REORGANIZING': 'Реорганизация',
}

export default function OsintToolsSection({ isActive }: OsintToolsSectionProps) {
  const [activeTool, setActiveTool] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phoneResult, setPhoneResult] = useState<PhoneResult | null>(null)
  const [innResults, setInnResults] = useState<InnResult[] | null>(null)
  const [links, setLinks] = useState<{ name: string; url: string }[] | null>(null)

  const clearResults = () => {
    setPhoneResult(null)
    setInnResults(null)
    setLinks(null)
    setError(null)
  }

  const handleToolChange = (index: number) => {
    setActiveTool(index)
    setQuery('')
    clearResults()
  }

  const handleSearch = async () => {
    const q = query.trim()
    if (!q) return
    clearResults()

    const tool = tools[activeTool]

    if (tool.type === 'links' && tool.getLinks) {
      setLinks(tool.getLinks(q))
      return
    }

    setLoading(true)
    try {
      const resp = await fetch(tool.apiUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await resp.json()

      if (data.error) {
        setError(data.error)
      } else if (tool.id === 'phone') {
        setPhoneResult(data.result)
      } else if (tool.id === 'inn') {
        setInnResults(data.results)
      }
    } catch {
      setError('Ошибка соединения. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const tool = tools[activeTool]

  return (
    <section className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[#4A9EFF] text-sm font-mono uppercase tracking-widest mb-3">Инструменты</p>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
          OSINT самостоятельно
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-5"
      >
        {tools.map((t, index) => (
          <button
            key={t.id}
            onClick={() => handleToolChange(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeTool === index
                ? 'bg-[#4A9EFF] border-[#4A9EFF] text-black'
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
            }`}
          >
            <Icon name={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="max-w-2xl"
      >
        <p className="text-white/40 text-sm mb-3">{tool.description}</p>
        <div className="flex gap-3">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={tool.placeholder}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-[#4A9EFF] focus-visible:ring-0"
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#4A9EFF] hover:bg-[#3a8eef] text-black font-semibold px-6 shrink-0"
          >
            {loading
              ? <Icon name="Loader2" size={16} className="animate-spin" />
              : <Icon name="Search" size={16} />
            }
          </Button>
        </div>

        <AnimatePresence mode="wait">

          {/* Ошибка */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-center gap-2"
            >
              <Icon name="AlertCircle" size={15} />
              {error}
            </motion.div>
          )}

          {/* Телефон */}
          {phoneResult && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded-xl border border-[#4A9EFF]/30 bg-[#4A9EFF]/5 p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Phone" size={16} className="text-[#4A9EFF]" />
                <span className="text-white font-semibold">{phoneResult.phone}</span>
                {phoneResult.qc === 0 && (
                  <span className="ml-auto text-xs text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full">Подтверждён</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {phoneResult.type && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Тип</p>
                    <p className="text-white text-sm">{phoneTypeMap[phoneResult.type] || phoneResult.type}</p>
                  </div>
                )}
                {phoneResult.carrier && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Оператор</p>
                    <p className="text-white text-sm">{phoneResult.carrier}</p>
                  </div>
                )}
                {phoneResult.region && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Регион</p>
                    <p className="text-white text-sm">{phoneResult.region}</p>
                  </div>
                )}
                {phoneResult.city && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Город</p>
                    <p className="text-white text-sm">{phoneResult.city}</p>
                  </div>
                )}
                {phoneResult.timezone && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Часовой пояс</p>
                    <p className="text-white text-sm">{phoneResult.timezone}</p>
                  </div>
                )}
                {phoneResult.country && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Страна</p>
                    <p className="text-white text-sm">{phoneResult.country}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ИНН */}
          {innResults && innResults.length > 0 && (
            <motion.div
              key="inn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1"
            >
              {innResults.map((r, i) => (
                <div key={i} className="rounded-xl border border-[#4A9EFF]/30 bg-[#4A9EFF]/5 p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Building2" size={15} className="text-[#4A9EFF] shrink-0 mt-0.5" />
                      <span className="text-white font-semibold text-sm leading-tight">{r.name}</span>
                    </div>
                    {r.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 border ${
                        r.status === 'ACTIVE'
                          ? 'text-green-400 border-green-400/30 bg-green-400/10'
                          : 'text-red-400 border-red-400/30 bg-red-400/10'
                      }`}>
                        {statusMap[r.status] || r.status}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {r.inn && (
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/40 text-xs mb-0.5">ИНН</p>
                        <p className="text-white text-sm font-mono">{r.inn}</p>
                      </div>
                    )}
                    {r.ogrn && (
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/40 text-xs mb-0.5">ОГРН</p>
                        <p className="text-white text-sm font-mono">{r.ogrn}</p>
                      </div>
                    )}
                    {r.director && (
                      <div className="bg-white/5 rounded-lg p-2 col-span-2">
                        <p className="text-white/40 text-xs mb-0.5">{r.director_post || 'Руководитель'}</p>
                        <p className="text-white text-sm">{r.director}</p>
                      </div>
                    )}
                    {r.address && (
                      <div className="bg-white/5 rounded-lg p-2 col-span-2">
                        <p className="text-white/40 text-xs mb-0.5">Адрес</p>
                        <p className="text-white text-sm leading-tight">{r.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {innResults && innResults.length === 0 && (
            <motion.div
              key="inn-empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white/50 text-sm flex items-center gap-2"
            >
              <Icon name="SearchX" size={15} />
              Ничего не найдено
            </motion.div>
          )}

          {/* Ссылки */}
          {links && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 grid grid-cols-2 gap-2"
            >
              {links.map(link => (
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
