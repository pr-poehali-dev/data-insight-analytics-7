import { Badge } from "@/components/ui/badge"

const TG_LINK = "https://t.me/+aL7cy_uOZgs3YmY6"

export const sections = [
  {
    id: 'hero',
    subtitle: (
      <div className="flex items-center gap-4 mb-2">
        <img
          src="https://cdn.poehali.dev/projects/c404ff97-39a7-4f64-b200-fe95dd951ab6/files/5132f811-d6f2-45ce-ac46-beee60fba1e2.jpg"
          alt="Логотип"
          className="w-16 h-16 object-contain rounded-xl opacity-90"
        />
        <Badge variant="outline" className="text-white border-white/40 bg-white/5">Сообщество открыто</Badge>
      </div>
    ),
    title: "Защита. Информация. Действие.",
    showButton: true,
    buttonText: 'Вступить в сообщество',
    buttonHref: TG_LINK,
  },
  {
    id: 'about',
    title: 'Кто мы?',
    content: 'Мы — сообщество экспертов, помогающих мирным гражданам защититься от угроз, разобраться в сложных ситуациях и получить реальную помощь в решении OSINT-задач.'
  },
  {
    id: 'features',
    title: 'Чем мы помогаем',
    content: 'Установление личности злоумышленников, сбор доказательной базы, консультации по защите персональных данных и юридическим шагам. Всё — анонимно и профессионально.'
  },
  {
    id: 'testimonials',
    title: 'Реальные кейсы',
    content: 'Сотни граждан уже получили помощь: от выявления мошенников до защиты от преследования. Ваша безопасность — наш приоритет.'
  },
  {
    id: 'join',
    title: 'Нужна помощь?',
    content: 'Опишите вашу ситуацию — наши специалисты разберут кейс и предложат конкретные шаги. Вы не одни.',
    showButton: true,
    buttonText: 'Написать нам',
    buttonHref: TG_LINK,
  },
]
