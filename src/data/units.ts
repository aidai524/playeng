export interface Word {
  id: string
  en: string
  cn: string
  phonetic?: string
  example?: string
  category: string
  emoji: string
}

export interface Dialogue {
  id: string
  title: string
  lines: { speaker: string; en: string; cn: string }[]
}

export interface SoundRule {
  letter: string
  sound: string
  words: string[]
}

export interface Unit {
  id: string
  title: string
  emoji: string
  words: Word[]
  dialogues: Dialogue[]
  soundTime?: SoundRule
}

export const units: Unit[] = [
  {
    id: "unit-1",
    title: "学校科目与设施",
    emoji: "🏫",
    words: [
      { id: "u1-01", en: "English", cn: "英语", category: "subject", emoji: "🇬🇧", example: "I like English." },
      { id: "u1-02", en: "Maths", cn: "数学", category: "subject", emoji: "🔢", example: "We have Maths today." },
      { id: "u1-03", en: "Music", cn: "音乐", category: "subject", emoji: "🎵", example: "I like Music class." },
      { id: "u1-04", en: "Art", cn: "美术", category: "subject", emoji: "🎨", example: "Let's draw in Art class." },
      { id: "u1-05", en: "PE", cn: "体育", category: "subject", emoji: "⚽", example: "PE is fun!" },
      { id: "u1-06", en: "Science", cn: "科学", category: "subject", emoji: "🔬", example: "We study animals in Science." },
      { id: "u1-07", en: "Chinese", cn: "语文", category: "subject", emoji: "📖", example: "Chinese is my first class." },
      { id: "u1-08", en: "school", cn: "学校", category: "place", emoji: "🏫", example: "I go to school every day." },
      { id: "u1-09", en: "subjects", cn: "科目", category: "thing", emoji: "📚", example: "What subjects do you like?" },
      { id: "u1-10", en: "timetable", cn: "课程表", category: "thing", emoji: "📋", example: "Look at the timetable." },
      { id: "u1-11", en: "classroom", cn: "教室", category: "place", emoji: "🏛️", example: "This is our classroom." },
      { id: "u1-12", en: "playground", cn: "操场", category: "place", emoji: "🏃", example: "Let's play on the playground." },
      { id: "u1-13", en: "term", cn: "学期", category: "thing", emoji: "📅", example: "This term we have many subjects." },
    ],
    dialogues: [
      {
        id: "u1-d1",
        title: "谈论喜欢的科目",
        lines: [
          { speaker: "A", en: "What subjects do you like?", cn: "你喜欢什么科目？" },
          { speaker: "B", en: "I like English and PE.", cn: "我喜欢英语和体育。" },
          { speaker: "A", en: "Me too. They are fun!", cn: "我也是。它们很有趣！" },
        ],
      },
    ],
  },
  {
    id: "unit-2",
    title: "星期与课外活动",
    emoji: "📅",
    words: [
      { id: "u2-01", en: "Monday", cn: "星期一", category: "day", emoji: "📅", example: "I have English on Monday." },
      { id: "u2-02", en: "Tuesday", cn: "星期二", category: "day", emoji: "📅", example: "Tuesday is a busy day." },
      { id: "u2-03", en: "Wednesday", cn: "星期三", category: "day", emoji: "📅", example: "We have Art on Wednesday." },
      { id: "u2-04", en: "Thursday", cn: "星期四", category: "day", emoji: "📅", example: "Thursday is after Wednesday." },
      { id: "u2-05", en: "Friday", cn: "星期五", category: "day", emoji: "📅", example: "I like Friday!" },
      { id: "u2-06", en: "Saturday", cn: "星期六", category: "day", emoji: "📅", example: "We don't have school on Saturday." },
      { id: "u2-07", en: "Sunday", cn: "星期日", category: "day", emoji: "📅", example: "Sunday is the first day of the week." },
      { id: "u2-08", en: "week", cn: "星期；周", category: "time", emoji: "📆", example: "There are seven days in a week." },
      { id: "u2-09", en: "match", cn: "比赛", category: "activity", emoji: "🏆", example: "We have a match today." },
      { id: "u2-10", en: "football match", cn: "足球比赛", category: "activity", emoji: "⚽", example: "There is a football match on Friday." },
      { id: "u2-11", en: "swimming lesson", cn: "游泳课", category: "activity", emoji: "🏊", example: "I have a swimming lesson on Saturday." },
      { id: "u2-12", en: "dancing lesson", cn: "舞蹈课", category: "activity", emoji: "💃", example: "She has a dancing lesson." },
      { id: "u2-13", en: "singing lesson", cn: "唱歌课", category: "activity", emoji: "🎤", example: "I like singing lessons." },
      { id: "u2-14", en: "busy", cn: "忙碌的", category: "adjective", emoji: "🏃‍♂️", example: "I am busy on Monday." },
      { id: "u2-15", en: "proud", cn: "骄傲的", category: "adjective", emoji: "😤", example: "I am proud of you!" },
      { id: "u2-16", en: "surprised", cn: "惊讶的", category: "adjective", emoji: "😮", example: "I am surprised!" },
      { id: "u2-17", en: "careless", cn: "粗心的", category: "adjective", emoji: "😅", example: "Don't be careless." },
    ],
    dialogues: [
      {
        id: "u2-d1",
        title: "谈论课程安排",
        lines: [
          { speaker: "A", en: "What day is it today?", cn: "今天星期几？" },
          { speaker: "B", en: "It's Monday.", cn: "今天是星期一。" },
          { speaker: "A", en: "What lessons do you have today?", cn: "你今天有什么课？" },
          { speaker: "B", en: "I have English, Maths and PE.", cn: "我有英语、数学和体育课。" },
        ],
      },
    ],
  },
  {
    id: "unit-3",
    title: "日常作息与时间",
    emoji: "⏰",
    words: [
      { id: "u3-01", en: "get up", cn: "起床", category: "action", emoji: "🛏️", example: "I get up at seven." },
      { id: "u3-02", en: "go to school", cn: "去上学", category: "action", emoji: "🚶", example: "I go to school at seven thirty." },
      { id: "u3-03", en: "have lessons", cn: "上课", category: "action", emoji: "📚", example: "We have lessons in the morning." },
      { id: "u3-04", en: "have lunch", cn: "吃午饭", category: "action", emoji: "🍱", example: "I have lunch at twelve." },
      { id: "u3-05", en: "go home", cn: "回家", category: "action", emoji: "🏠", example: "I go home at four thirty." },
      { id: "u3-06", en: "do my homework", cn: "做作业", category: "action", emoji: "📝", example: "I do my homework after school." },
      { id: "u3-07", en: "have dinner", cn: "吃晚饭", category: "action", emoji: "🍽️", example: "I have dinner at six." },
      { id: "u3-08", en: "go to bed", cn: "上床睡觉", category: "action", emoji: "😴", example: "I go to bed at nine." },
      { id: "u3-09", en: "usually", cn: "通常", category: "adverb", emoji: "🔄", example: "I usually get up at seven." },
      { id: "u3-10", en: "every day", cn: "每天", category: "adverb", emoji: "📆", example: "I read books every day." },
      { id: "u3-11", en: "time", cn: "时间", category: "thing", emoji: "⏰", example: "What time is it?" },
      { id: "u3-12", en: "clock", cn: "钟", category: "thing", emoji: "🕐", example: "Look at the clock." },
      { id: "u3-13", en: "morning", cn: "早上", category: "time", emoji: "🌅", example: "Good morning!" },
      { id: "u3-14", en: "afternoon", cn: "下午", category: "time", emoji: "☀️", example: "Good afternoon!" },
      { id: "u3-15", en: "evening", cn: "傍晚", category: "time", emoji: "🌆", example: "Good evening!" },
      { id: "u3-16", en: "night", cn: "夜晚", category: "time", emoji: "🌙", example: "Good night!" },
      { id: "u3-17", en: "brush one's teeth", cn: "刷牙", category: "action", emoji: "🪥", example: "I brush my teeth every morning." },
      { id: "u3-18", en: "wash face", cn: "洗脸", category: "action", emoji: "🧼", example: "I wash my face after getting up." },
    ],
    dialogues: [
      {
        id: "u3-d1",
        title: "谈论日常作息",
        lines: [
          { speaker: "A", en: "When do you get up?", cn: "你什么时候起床？" },
          { speaker: "B", en: "I usually get up at seven.", cn: "我通常七点起床。" },
          { speaker: "A", en: "When do you go to school?", cn: "你什么时候去上学？" },
          { speaker: "B", en: "I go to school at seven thirty.", cn: "我七点半去上学。" },
        ],
      },
    ],
  },
  {
    id: "unit-4",
    title: "公园、自然与能力",
    emoji: "🌳",
    words: [
      { id: "u4-01", en: "trees", cn: "树", category: "nature", emoji: "🌳", example: "There are many trees in the park." },
      { id: "u4-02", en: "flowers", cn: "花", category: "nature", emoji: "🌸", example: "The flowers are beautiful." },
      { id: "u4-03", en: "river", cn: "河流", category: "nature", emoji: "🏞️", example: "There is a river in the park." },
      { id: "u4-04", en: "bridge", cn: "桥", category: "nature", emoji: "🌉", example: "Let's cross the bridge." },
      { id: "u4-05", en: "boat", cn: "船", category: "nature", emoji: "⛵", example: "I can see a boat on the lake." },
      { id: "u4-06", en: "lake", cn: "湖", category: "nature", emoji: "🏞️", example: "The lake is very big." },
      { id: "u4-07", en: "sky", cn: "天空", category: "nature", emoji: "🌤️", example: "Look at the sky!" },
      { id: "u4-08", en: "bird", cn: "鸟", category: "nature", emoji: "🐦", example: "I can see a bird." },
      { id: "u4-09", en: "kite", cn: "风筝", category: "thing", emoji: "🪁", example: "Let's fly a kite!" },
      { id: "u4-10", en: "draw", cn: "画", category: "action", emoji: "✏️", example: "I can draw a picture." },
      { id: "u4-11", en: "see", cn: "看见", category: "action", emoji: "👀", example: "What can you see?" },
      { id: "u4-12", en: "swim", cn: "游泳", category: "action", emoji: "🏊", example: "I can swim." },
      { id: "u4-13", en: "sing", cn: "唱歌", category: "action", emoji: "🎤", example: "I can sing a song." },
      { id: "u4-14", en: "run", cn: "跑步", category: "action", emoji: "🏃", example: "I can run fast." },
      { id: "u4-15", en: "play basketball", cn: "打篮球", category: "action", emoji: "🏀", example: "Can you play basketball?" },
      { id: "u4-16", en: "play football", cn: "踢足球", category: "action", emoji: "⚽", example: "Let's play football!" },
      { id: "u4-17", en: "skate", cn: "滑冰", category: "action", emoji: "⛸️", example: "I can skate." },
      { id: "u4-18", en: "jump", cn: "跳", category: "action", emoji: "🦘", example: "I can jump high." },
      { id: "u4-19", en: "fly a kite", cn: "放风筝", category: "action", emoji: "🪁", example: "I can fly a kite." },
      { id: "u4-20", en: "ride a bike", cn: "骑自行车", category: "action", emoji: "🚲", example: "I can ride a bike." },
      { id: "u4-21", en: "easy", cn: "容易的", category: "adjective", emoji: "😊", example: "This is easy!" },
      { id: "u4-22", en: "difficult", cn: "困难的", category: "adjective", emoji: "🤔", example: "This is difficult." },
      { id: "u4-23", en: "well done", cn: "做得好", category: "phrase", emoji: "👍", example: "Well done!" },
    ],
    dialogues: [
      {
        id: "u4-d1",
        title: "在公园里",
        lines: [
          { speaker: "A", en: "What can you see?", cn: "你能看到什么？" },
          { speaker: "B", en: "I can see trees and flowers.", cn: "我能看到树和花。" },
          { speaker: "A", en: "Can you draw them?", cn: "你会画它们吗？" },
          { speaker: "B", en: "Yes, I can. It's easy!", cn: "是的，我会。很简单！" },
        ],
      },
    ],
  },
  {
    id: "unit-5",
    title: "季节、天气与颜色",
    emoji: "🌈",
    words: [
      { id: "u5-01", en: "spring", cn: "春天", category: "season", emoji: "🌸", example: "Spring is warm." },
      { id: "u5-02", en: "summer", cn: "夏天", category: "season", emoji: "☀️", example: "Summer is hot." },
      { id: "u5-03", en: "autumn", cn: "秋天", category: "season", emoji: "🍂", example: "Autumn is cool." },
      { id: "u5-04", en: "winter", cn: "冬天", category: "season", emoji: "❄️", example: "Winter is cold." },
      { id: "u5-05", en: "warm", cn: "温暖的", category: "weather", emoji: "🌤️", example: "It is warm in spring." },
      { id: "u5-06", en: "hot", cn: "热的", category: "weather", emoji: "🔥", example: "It is hot in summer." },
      { id: "u5-07", en: "cool", cn: "凉爽的", category: "weather", emoji: "🍃", example: "It is cool in autumn." },
      { id: "u5-08", en: "cold", cn: "冷的", category: "weather", emoji: "🥶", example: "It is cold in winter." },
      { id: "u5-09", en: "sunny", cn: "晴朗的", category: "weather", emoji: "☀️", example: "It is sunny today." },
      { id: "u5-10", en: "rainy", cn: "下雨的", category: "weather", emoji: "🌧️", example: "It is rainy today." },
      { id: "u5-11", en: "snowy", cn: "下雪的", category: "weather", emoji: "🌨️", example: "It is snowy in winter." },
      { id: "u5-12", en: "fine", cn: "好的（天气）", category: "weather", emoji: "🌤️", example: "It's a fine day." },
      { id: "u5-13", en: "go boating", cn: "去划船", category: "activity", emoji: "⛵", example: "Let's go boating in spring." },
      { id: "u5-14", en: "make snowmen", cn: "堆雪人", category: "activity", emoji: "⛄", example: "We make snowmen in winter." },
    ],
    dialogues: [
      {
        id: "u5-d1",
        title: "谈论季节",
        lines: [
          { speaker: "A", en: "What season do you like?", cn: "你喜欢什么季节？" },
          { speaker: "B", en: "I like spring. It's warm.", cn: "我喜欢春天。很温暖。" },
          { speaker: "A", en: "What do you do in spring?", cn: "春天你做什么？" },
          { speaker: "B", en: "I go boating and fly kites.", cn: "我去划船和放风筝。" },
        ],
      },
    ],
  },
  {
    id: "unit-6",
    title: "衣物与所属",
    emoji: "👔",
    words: [
      { id: "u6-01", en: "dress", cn: "连衣裙", category: "clothes", emoji: "👗", example: "This is a beautiful dress." },
      { id: "u6-02", en: "trousers", cn: "裤子", category: "clothes", emoji: "👖", example: "I like these trousers." },
      { id: "u6-03", en: "pants", cn: "裤子（美式）", category: "clothes", emoji: "👖", example: "He wears long pants." },
      { id: "u6-04", en: "gloves", cn: "手套", category: "clothes", emoji: "🧤", example: "Put on your gloves." },
      { id: "u6-05", en: "shirt", cn: "衬衫", category: "clothes", emoji: "👔", example: "This is a white shirt." },
      { id: "u6-06", en: "shoes", cn: "鞋子", category: "clothes", emoji: "👟", example: "These are my shoes." },
      { id: "u6-07", en: "cap", cn: "帽子", category: "clothes", emoji: "🧢", example: "I have a red cap." },
      { id: "u6-08", en: "jacket", cn: "夹克", category: "clothes", emoji: "🧥", example: "Put on your jacket." },
      { id: "u6-09", en: "sweater", cn: "毛衣", category: "clothes", emoji: "🧶", example: "This sweater is warm." },
      { id: "u6-10", en: "coat", cn: "外套", category: "clothes", emoji: "🧥", example: "It's cold. Put on your coat." },
      { id: "u6-11", en: "T-shirt", cn: "T恤", category: "clothes", emoji: "👕", example: "I like this T-shirt." },
      { id: "u6-12", en: "down jacket", cn: "羽绒服", category: "clothes", emoji: "🧥", example: "I wear a down jacket in winter." },
      { id: "u6-13", en: "big", cn: "大的", category: "adjective", emoji: "📏", example: "This coat is too big." },
      { id: "u6-14", en: "long", cn: "长的", category: "adjective", emoji: "📏", example: "These trousers are too long." },
      { id: "u6-15", en: "small", cn: "小的", category: "adjective", emoji: "📏", example: "This is too small for me." },
      { id: "u6-16", en: "short", cn: "短的", category: "adjective", emoji: "📏", example: "These shorts are too short." },
      { id: "u6-17", en: "beautiful", cn: "漂亮的", category: "adjective", emoji: "✨", example: "Your dress is beautiful!" },
      { id: "u6-18", en: "nice", cn: "好看的", category: "adjective", emoji: "👍", example: "This is a nice shirt." },
      { id: "u6-19", en: "cousin", cn: "表/堂兄弟姐妹", category: "person", emoji: "👫", example: "This is my cousin." },
      { id: "u6-20", en: "father", cn: "爸爸", category: "person", emoji: "👨", example: "My father is tall." },
      { id: "u6-21", en: "brother", cn: "兄弟", category: "person", emoji: "👦", example: "This is my brother." },
    ],
    dialogues: [
      {
        id: "u6-d1",
        title: "试衣服",
        lines: [
          { speaker: "A", en: "Look at this dress.", cn: "看这条连衣裙。" },
          { speaker: "B", en: "It's beautiful! Is it big?", cn: "真漂亮！大吗？" },
          { speaker: "A", en: "No, it's not too big. It's just right.", cn: "不，不太大。刚刚好。" },
        ],
      },
    ],
  },
  {
    id: "unit-7",
    title: "感受与情绪",
    emoji: "😊",
    words: [
      { id: "u7-01", en: "happy", cn: "开心的", category: "feeling", emoji: "😊", example: "I am happy today." },
      { id: "u7-02", en: "hungry", cn: "饿的", category: "feeling", emoji: "🤤", example: "I am hungry." },
      { id: "u7-03", en: "ill", cn: "生病的", category: "feeling", emoji: "🤒", example: "I am ill today." },
      { id: "u7-04", en: "sad", cn: "伤心的", category: "feeling", emoji: "😢", example: "She is sad." },
      { id: "u7-05", en: "thirsty", cn: "渴的", category: "feeling", emoji: "🥤", example: "I am thirsty." },
      { id: "u7-06", en: "tired", cn: "累的", category: "feeling", emoji: "😴", example: "I am tired after school." },
      { id: "u7-07", en: "sleepy", cn: "困的", category: "feeling", emoji: "😪", example: "I am sleepy." },
      { id: "u7-08", en: "afraid", cn: "害怕的", category: "feeling", emoji: "😨", example: "Don't be afraid." },
      { id: "u7-09", en: "tomorrow", cn: "明天", category: "time", emoji: "📅", example: "See you tomorrow!" },
      { id: "u7-10", en: "see you", cn: "再见", category: "phrase", emoji: "👋", example: "See you tomorrow!" },
    ],
    dialogues: [
      {
        id: "u7-d1",
        title: "谈论感受",
        lines: [
          { speaker: "A", en: "How are you?", cn: "你好吗？" },
          { speaker: "B", en: "I'm happy. And you?", cn: "我很开心。你呢？" },
          { speaker: "A", en: "I'm tired.", cn: "我很累。" },
          { speaker: "B", en: "Have a rest!", cn: "休息一下吧！" },
        ],
      },
    ],
  },
  {
    id: "unit-8",
    title: "健康与语音",
    emoji: "🏥",
    words: [
      { id: "u8-01", en: "fever", cn: "发烧", category: "health", emoji: "🤒", example: "I have a fever." },
      { id: "u8-02", en: "cold", cn: "感冒", category: "health", emoji: "🤧", example: "I have a cold." },
      { id: "u8-03", en: "have a cold", cn: "得了感冒", category: "phrase", emoji: "🤧", example: "She has a cold." },
      { id: "u8-04", en: "better", cn: "更好", category: "adjective", emoji: "💪", example: "Are you better now?" },
      { id: "u8-05", en: "take care", cn: "保重", category: "phrase", emoji: "🤗", example: "Take care!" },
      { id: "u8-06", en: "telephone", cn: "电话", category: "thing", emoji: "📞", example: "May I use the telephone?" },
      { id: "u8-07", en: "cake", cn: "蛋糕", category: "sound-a", emoji: "🎂", example: "I like cake." },
      { id: "u8-08", en: "grape", cn: "葡萄", category: "sound-a", emoji: "🍇", example: "Grapes are sweet." },
      { id: "u8-09", en: "skate", cn: "滑冰", category: "sound-a", emoji: "⛸️", example: "I can skate." },
      { id: "u8-10", en: "lake", cn: "湖", category: "sound-a", emoji: "🏞️", example: "The lake is big." },
      { id: "u8-11", en: "make", cn: "制作", category: "sound-a", emoji: "🔨", example: "Let's make a cake." },
      { id: "u8-12", en: "game", cn: "游戏", category: "sound-a", emoji: "🎮", example: "Let's play a game." },
      { id: "u8-13", en: "late", cn: "迟的", category: "sound-a", emoji: "⏰", example: "I am late!" },
      { id: "u8-14", en: "name", cn: "名字", category: "sound-a", emoji: "📛", example: "What's your name?" },
      { id: "u8-15", en: "desk", cn: "课桌", category: "sound-e", emoji: "🪑", example: "This is my desk." },
      { id: "u8-16", en: "pen", cn: "钢笔", category: "sound-e", emoji: "🖊️", example: "I have a pen." },
      { id: "u8-17", en: "red", cn: "红色的", category: "sound-e", emoji: "🔴", example: "The pen is red." },
      { id: "u8-18", en: "bed", cn: "床", category: "sound-e", emoji: "🛏️", example: "This is my bed." },
      { id: "u8-19", en: "seven", cn: "七", category: "sound-e", emoji: "7️⃣", example: "I get up at seven." },
      { id: "u8-20", en: "tree", cn: "树", category: "sound-ee", emoji: "🌳", example: "There is a big tree." },
      { id: "u8-21", en: "green", cn: "绿色的", category: "sound-ee", emoji: "🟢", example: "The tree is green." },
      { id: "u8-22", en: "sleep", cn: "睡觉", category: "sound-ee", emoji: "😴", example: "I sleep at nine." },
      { id: "u8-23", en: "feet", cn: "脚（复数）", category: "sound-ee", emoji: "🦶", example: "Wash your feet." },
      { id: "u8-24", en: "sheep", cn: "绵羊", category: "sound-ee", emoji: "🐑", example: "I can see sheep." },
      { id: "u8-25", en: "teeth", cn: "牙齿（复数）", category: "sound-ee", emoji: "🦷", example: "Brush your teeth." },
      { id: "u8-26", en: "bee", cn: "蜜蜂", category: "sound-ee", emoji: "🐝", example: "The bee is on the flower." },
      { id: "u8-27", en: "knee", cn: "膝盖", category: "sound-ee", emoji: "🦵", example: "I hurt my knee." },
      { id: "u8-28", en: "rice", cn: "米饭", category: "sound-i", emoji: "🍚", example: "I like rice." },
      { id: "u8-29", en: "bike", cn: "自行车", category: "sound-i", emoji: "🚲", example: "I can ride a bike." },
      { id: "u8-30", en: "five", cn: "五", category: "sound-i", emoji: "5️⃣", example: "There are five birds." },
      { id: "u8-31", en: "nine", cn: "九", category: "sound-i", emoji: "9️⃣", example: "I go to bed at nine." },
      { id: "u8-32", en: "white", cn: "白色的", category: "sound-i", emoji: "⚪", example: "The kite is white." },
      { id: "u8-33", en: "time", cn: "时间", category: "sound-i", emoji: "⏰", example: "What time is it?" },
    ],
    dialogues: [
      {
        id: "u8-d1",
        title: "打电话问候",
        lines: [
          { speaker: "A", en: "Hello, this is Tom. How are you?", cn: "你好，我是Tom。你好吗？" },
          { speaker: "B", en: "I'm ill. I have a fever.", cn: "我生病了。我发烧了。" },
          { speaker: "A", en: "I'm sorry. Take care!", cn: "真遗憾。保重！" },
          { speaker: "B", en: "Thank you. See you.", cn: "谢谢。再见。" },
        ],
      },
    ],
    soundTime: {
      letter: "a / e / ee / i",
      sound: "/eɪ/ /e/ /i:/ /aɪ/",
      words: ["cake", "grape", "skate", "lake", "desk", "pen", "red", "tree", "green", "sleep", "rice", "bike", "five", "nine", "white"],
    },
  },
]
