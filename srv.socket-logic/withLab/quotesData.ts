export const quotesData: { quote: string; author: string; }[] = [
  {
    quote: 'Стремитесь не к успеху, а к ценностям, которые он дает',
    author: 'Albert Einstein',
  },
  {
    quote: 'Сложнее всего начать действовать, все остальное зависит только от упорства',
    author: 'Amelia Mary Earhart',
  },
  {
    quote: 'Жизнь - это то, что с тобой происходит, пока ты строишь планы',
    author: 'Джон Леннон',
  },
  {
    quote: 'Начинать всегда стоит с того, что сеет сомнения',
    author: 'Борис Стругацкий',
  },
  {
    quote: 'Настоящая ответственность бывает только личной',
    author: 'Фазиль Искандер',
  },
  {
    quote: 'Свобода ничего не стоит, если она не включает в себя свободу ошибаться',
    author: 'Махатма Ганди',
  },
  {
    quote: 'Два самых важных дня в твоей жизни: день, когда ты появился на свет, и день, когда понял, зачем.',
    author: 'Марк Твен',
  },
  {
    quote: 'Есть только один способ избежать критики: ничего не делайте, ничего не говорите и будьте никем',
    author: 'Аристотель',
  },
  {
    quote: 'Человек, которым вам суждено стать – это только тот человек, которым вы сами решите стать',
    author: 'Ральф Уолдо Эмерсон',
  },
  {
    quote: 'Лучше быть уверенным в хорошем результате, чем надеяться на отличный',
    author: 'Уоррен Баффет',
  },
  {
    quote: 'Упади семь раз и восемь раз поднимись',
    author: 'Японская поговорка',
  },
  {
    quote: 'У всего есть своя красота, но не каждый может ее увидеть',
    author: 'Конфуций',
  },
  {
    quote: 'Когда я освобождаюсь от того, кто я есть, я становлюсь тем, кем я могу быть',
    author: 'Лао Цзы',
  },
  {
    quote: 'Если нет ветра, беритесь за вёсла',
    author: 'Латинская поговорка',
  },
  {
    quote: 'Лучшее время, чтобы посадить дерево, было 20 лет назад. Следующий подходящий момент - сегодня',
    author: 'Китайская пословица',
  },
  {
    quote: 'Никогда не делает ошибок только тот, кто не пробует ничего нового',
    author: 'Альберт Эйнштейн',
  },
  {
    quote: 'Не столь важно, как медленно ты идешь, как то, как долго ты идешь, не останавливаясь',
    author: 'Конфуций',
  },
  {
    quote: 'Если вы думаете о том, что имеете в жизни, вы всегда сможете иметь больше. Если же вы считаете, чего у вас нет, вам никогда не будет достаточно',
    author: 'Опра Уинфри',
  },
  {
    quote: 'Всегда выбирайте самый трудный путь - на нем вы не встретите конкурентов',
    author: 'Шарль де Голль',
  },
  {
    quote: 'Выживает не самый сильный, а самый восприимчивый к переменам',
    author: 'Чарльз Дарвин',
  },
  {
    quote: 'Ни разу не упасть — не самая большая заслуга в жизни. Главное каждый раз подниматься',
    author: 'Нельсон Мандела',
  },
  {
    quote: 'Лично для меня асинхронность означает, что выполнение цепочки блоков кода может выполняться необязательно в той последовательности, в которой он написан в нашей программе [исходном коде]',
    author: 'Demi Murych',
  },
  {
    quote: 'К слову понимания асинхронности. Какие шаги проходит современный JS код прежде чем он начинает выполняться? Главная часть вопроса: Мы знаем, что JS не обладает своим вводом-выводом, он должен быть куда-то встроен (напр, в браузер, ноду и т.д.). Какие шаги должен предпринять браузер, чтобы, получив текстовый файл, начинать заставить рантайм (хост-среда, агент V8) выполнять? (парсит непосредственно, рантайм) Ровно такой же набор шагов как при первой подготовке выполнения JS кода происходит перед выполнением любой другой функции, будь то она синхронная / асинхронная, выполненная при помощи внешнего АПИ и т.д. Вопрос демонстрирует то, какой именно информации не хватает, чтоб понять, каким образом рантайм начинает выполнять этот код',
    author: 'Demi Murych',
  },
  {
    quote: 'Про Execution Context. Некоторый Exotic Object Array у которого каждый элемент представляет из себя [нечто], описывающее [что-то], в виде структуры, одно из полей которого указывает на исходный код. Для того, чтобы наш рантайм начал с чем-то работать, он должен из этой структуры получить ту единственную запись внутри которой будет ссылка на текст того файла, с предполагаемым js кодом',
    author: 'Demi Murych',
  },
  {
    quote: 'Про setTimeout (внешнее WebAPI хост среды): внутрь этого АПИ мы передали фактически строковое представление программы функции, указанной в качестве коллбэка. Когда подходит время (решает не JS, а сама хост среда), формируется спец. структура (Execution Context) и происходит пуш на вершину стека этой структуры. V8 - это агент, который все время проверяет, не появилась ли в этой структуре новая запись...',
    author: 'Demi Murych',
  },
]
