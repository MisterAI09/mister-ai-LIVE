import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [showAllChannels, setShowAllChannels] = useState(false);

  // 🔴 القنوات الخارجية (تفتح في نافذة جديدة) - ottv.pro
  const externalChannels = [
    // beIN SPORTS Max 1 - جودات مختلفة
    { 
      id: "ext1", 
      title: "📡 beIN SPORTS Max 1 4K", 
      category: "sports", 
      quality: "4K", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432904.m3u8",
      color: "#FF0000"
    },
    { 
      id: "ext2", 
      title: "📡 beIN SPORTS Max 1 FHD", 
      category: "sports", 
      quality: "FHD", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432903.m3u8",
      color: "#FF4500"
    },
    { 
      id: "ext3", 
      title: "📡 beIN SPORTS Max 1 HD", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432902.m3u8",
      color: "#FF6347"
    },
    { 
      id: "ext4", 
      title: "📡 beIN SPORTS Max 1 SD", 
      category: "sports", 
      quality: "SD", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432901.m3u8",
      color: "#FF7F50"
    },

    // beIN SPORTS Max 2 - جودات مختلفة
    { 
      id: "ext5", 
      title: "📡 beIN SPORTS Max 2 4K", 
      category: "sports", 
      quality: "4K", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432900.m3u8",
      color: "#DC143C"
    },
    { 
      id: "ext6", 
      title: "📡 beIN SPORTS Max 2 FHD", 
      category: "sports", 
      quality: "FHD", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432899.m3u8",
      color: "#B22222"
    },
    { 
      id: "ext7", 
      title: "📡 beIN SPORTS Max 2 HD", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432898.m3u8",
      color: "#8B0000"
    },
    { 
      id: "ext8", 
      title: "📡 beIN SPORTS Max 2 SD", 
      category: "sports", 
      quality: "SD", 
      lang: "ar", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432897.m3u8",
      color: "#800000"
    },

    // beIN SPORTS Max 3 (EN) - جودات مختلفة
    { 
      id: "ext9", 
      title: "📡 beIN SPORTS Max 3 4K (EN)", 
      category: "sports", 
      quality: "4K", 
      lang: "en", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432896.m3u8",
      color: "#006400"
    },
    { 
      id: "ext10", 
      title: "📡 beIN SPORTS Max 3 FHD (EN)", 
      category: "sports", 
      quality: "FHD", 
      lang: "en", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432895.m3u8",
      color: "#228B22"
    },
    { 
      id: "ext11", 
      title: "📡 beIN SPORTS Max 3 HD (EN)", 
      category: "sports", 
      quality: "HD", 
      lang: "en", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432894.m3u8",
      color: "#32CD32"
    },

    // beIN SPORTS Max 4 (FR) - جودات مختلفة
    { 
      id: "ext12", 
      title: "📡 beIN SPORTS Max 4 4K (FR)", 
      category: "sports", 
      quality: "4K", 
      lang: "fr", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432892.m3u8",
      color: "#000080"
    },
    { 
      id: "ext13", 
      title: "📡 beIN SPORTS Max 4 FHD (FR)", 
      category: "sports", 
      quality: "FHD", 
      lang: "fr", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432891.m3u8",
      color: "#0000CD"
    },
    { 
      id: "ext14", 
      title: "📡 beIN SPORTS Max 4 HD (FR)", 
      category: "sports", 
      quality: "HD", 
      lang: "fr", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432890.m3u8",
      color: "#4169E1"
    },
    { 
      id: "ext15", 
      title: "📡 beIN SPORTS Max 4 SD (FR)", 
      category: "sports", 
      quality: "SD", 
      lang: "fr", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432889.m3u8",
      color: "#6495ED"
    },

    // قنوات جزائرية خارجية
    { 
      id: "ext16", 
      title: "🇩🇿 PROGRAMME NATIONAL ALGÉRIE HD", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432888.m3u8",
      color: "#008000"
    },
    { 
      id: "ext17", 
      title: "🇩🇿 EL BILAD TV", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/351100.m3u8",
      color: "#006400"
    },
    { 
      id: "ext18", 
      title: "🇩🇿 ALGERIE 6", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/327314.m3u8",
      color: "#228B22"
    },
    { 
      id: "ext19", 
      title: "🇩🇿 ALGERIE 8", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/295979.m3u8",
      color: "#32CD32"
    },
    { 
      id: "ext20", 
      title: "🇩🇿 AL 24 NEWS", 
      category: "news", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/295221.m3u8",
      color: "#ADFF2F"
    },
    { 
      id: "ext21", 
      title: "🇩🇿 ALGERIE 7", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/152921.m3u8",
      color: "#7CFC00"
    },
    { 
      id: "ext22", 
      title: "🇩🇿 CANAL ALGERIE", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/1687.m3u8",
      color: "#00FF00"
    },
    { 
      id: "ext23", 
      title: "🇩🇿 A3 ALGERIE", 
      category: "national", 
      quality: "HD", 
      lang: "ar", 
      country: "DZ",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/1675.m3u8",
      color: "#90EE90"
    },

    // قنوات كندية أخرى
    { 
      id: "ext24", 
      title: "🍁 CANAL+ CAN HD", 
      category: "entertainment", 
      quality: "HD", 
      lang: "fr", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432884.m3u8",
      color: "#8A2BE2"
    },
    { 
      id: "ext25", 
      title: "⚽ beIN SPORTS 1 (CA) HD", 
      category: "sports", 
      quality: "HD", 
      lang: "fr", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432883.m3u8",
      color: "#9932CC"
    },
    { 
      id: "ext26", 
      title: "⚽ beIN SPORTS 2 (CA) HD", 
      category: "sports", 
      quality: "HD", 
      lang: "fr", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432882.m3u8",
      color: "#9400D3"
    },
    { 
      id: "ext27", 
      title: "⚽ LALIGA+ TV (CA) HD", 
      category: "sports", 
      quality: "HD", 
      lang: "es", 
      country: "CA",
      type: "external",
      url: "http://fr.ottv.pro/live/4476647188407159/4476647188407159/432881.m3u8",
      color: "#8B008B"
    },
  ];

  // 🟢 قنوات مباشرة تعمل داخل الموقع - Rakuten TV
  const directChannels = [
    // Rakuten Movies - UK
    { 
      id: "dir1", 
      title: "🎬 Rakuten Top Movies UK", 
      category: "movies", 
      quality: "FHD", 
      lang: "en", 
      country: "UK",
      type: "direct",
      url: "https://0145451975a64b35866170fd2e8fa486.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5987/master.m3u8",
      color: "#FF1493"
    },
    { 
      id: "dir2", 
      title: "🎬 Rakuten Action Movies UK", 
      category: "movies", 
      quality: "FHD", 
      lang: "en", 
      country: "UK",
      type: "direct",
      url: "https://54045f0c40fd442c8b06df076aaf1e85.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6065/master.m3u8",
      color: "#C71585"
    },
    { 
      id: "dir3", 
      title: "🎬 Rakuten Comedy Movies UK", 
      category: "movies", 
      quality: "FHD", 
      lang: "en", 
      country: "UK",
      type: "direct",
      url: "https://9be783d652cd4b099cf63e1dc134c4a3.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6181/master.m3u8",
      color: "#DB7093"
    },
    { 
      id: "dir4", 
      title: "🎬 Rakuten Drama Movies UK", 
      category: "movies", 
      quality: "FHD", 
      lang: "en", 
      country: "UK",
      type: "direct",
      url: "https://fee09fd665814f51b939b6d106cf5f66.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6093/master.m3u8",
      color: "#FF69B4"
    },

    // Rakuten Movies - Germany
    { 
      id: "dir5", 
      title: "🎬 Rakuten Top Movies Germany", 
      category: "movies", 
      quality: "FHD", 
      lang: "de", 
      country: "DE",
      type: "direct",
      url: "https://cbb622b29f5d43b598991f3fa19de291.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-5985/master.m3u8",
      color: "#4682B4"
    },
    { 
      id: "dir6", 
      title: "🎬 Rakuten Action Movies Germany", 
      category: "movies", 
      quality: "FHD", 
      lang: "de", 
      country: "DE",
      type: "direct",
      url: "https://284824cf70404fdfb6ddf9349009c710.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6066/master.m3u8",
      color: "#5F9EA0"
    },
    { 
      id: "dir7", 
      title: "🎬 Rakuten Comedy Movies Germany", 
      category: "movies", 
      quality: "FHD", 
      lang: "de", 
      country: "DE",
      type: "direct",
      url: "https://ecac08c9e2214375b907d6825aaf9a01.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6182/master.m3u8",
      color: "#6495ED"
    },

    // Rakuten Movies - Italy
    { 
      id: "dir8", 
      title: "🎬 Rakuten Top Movies Italy", 
      category: "movies", 
      quality: "FHD", 
      lang: "it", 
      country: "IT",
      type: "direct",
      url: "https://f84e0b1628464fab846160df957f269e.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6094/master.m3u8",
      color: "#D2691E"
    },
    { 
      id: "dir9", 
      title: "🎬 Rakuten Action Movies Italy", 
      category: "movies", 
      quality: "FHD", 
      lang: "it", 
      country: "IT",
      type: "direct",
      url: "https://87f2e2e5e7624e3bad85da1ca2ed31a7.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6067/master.m3u8",
      color: "#8B4513"
    },
    { 
      id: "dir10", 
      title: "🎬 Rakuten Comedy Movies Italy", 
      category: "movies", 
      quality: "FHD", 
      lang: "it", 
      country: "IT",
      type: "direct",
      url: "https://b8bc6c4b9be64bd6aeb3b92aa8521ed4.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6184/master.m3u8",
      color: "#A0522D"
    },

    // Rakuten Movies - Spain
    { 
      id: "dir11", 
      title: "🎬 Rakuten Top Movies Spain", 
      category: "movies", 
      quality: "FHD", 
      lang: "es", 
      country: "ES",
      type: "direct",
      url: "https://a7089c89d85f453d850c4a1518b43076.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6092/master.m3u8",
      color: "#B8860B"
    },
    { 
      id: "dir12", 
      title: "🎬 Rakuten Action Movies Spain", 
      category: "movies", 
      quality: "FHD", 
      lang: "es", 
      country: "ES",
      type: "direct",
      url: "https://a9c57ec7ec5e4b7daeacc6316a0bb404.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6069/master.m3u8",
      color: "#DAA520"
    },
    { 
      id: "dir13", 
      title: "🎬 Rakuten Comedy Movies Spain", 
      category: "movies", 
      quality: "FHD", 
      lang: "es", 
      country: "ES",
      type: "direct",
      url: "https://71db867f03ce4d71a29e92155f07ab87.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6180/master.m3u8",
      color: "#FFD700"
    },

    // Rakuten Movies - Finland
    { 
      id: "dir14", 
      title: "🎬 Rakuten Top Movies Finland", 
      category: "movies", 
      quality: "FHD", 
      lang: "fi", 
      country: "FI",
      type: "direct",
      url: "https://1d1b0d4cb6ae4c31985d13221795695b.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6057/master.m3u8",
      color: "#2E8B57"
    },
    { 
      id: "dir15", 
      title: "🎬 Rakuten Action Movies Finland", 
      category: "movies", 
      quality: "FHD", 
      lang: "fi", 
      country: "FI",
      type: "direct",
      url: "https://bca5a421a70c46ad911efd0a4767c4bf.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6075/master.m3u8",
      color: "#3CB371"
    },
    { 
      id: "dir16", 
      title: "🎬 Rakuten Comedy Movies Finland", 
      category: "movies", 
      quality: "FHD", 
      lang: "fi", 
      country: "FI",
      type: "direct",
      url: "https://a300af98e00746e2acf2346f43e47bd1.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6191/master.m3u8",
      color: "#66CDAA"
    },

    // Rakuten Movies - Nordic
    { 
      id: "dir17", 
      title: "🎬 Rakuten Drama Movies Finland", 
      category: "movies", 
      quality: "FHD", 
      lang: "fi", 
      country: "FI",
      type: "direct",
      url: "https://d7e8ee3c924d4305a0c1840fe94c5d36.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6102/master.m3u8",
      color: "#8FBC8F"
    },
    { 
      id: "dir18", 
      title: "🎬 Rakuten Nordic Films", 
      category: "movies", 
      quality: "FHD", 
      lang: "no", 
      country: "NO",
      type: "direct",
      url: "https://4aa9ef08b70d4b0c8f3519c5950b1930.mediatailor.eu-west-1.amazonaws.com/v1/master/0547f18649bd788bec7b67b746e47670f558b6b2/production-LiveChannel-6303/master.m3u8",
      color: "#98FB98"
    },

    // قنوات اختبار داخلية (MP4 - تعمل دائماً)
    { 
      id: "test1", 
      title: "📺 Test Channel 1 (MP4)", 
      category: "test", 
      quality: "HD", 
      lang: "en", 
      country: "TEST",
      type: "direct",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      color: "#00CED1"
    },
    { 
      id: "test2", 
      title: "📺 Test Channel 2 (MP4)", 
      category: "test", 
      quality: "HD", 
      lang: "en", 
      country: "TEST",
      type: "direct",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      color: "#40E0D0"
    },
  ];

  // 🟡 قنوات تعمل عبر البروكسي (النظام الأصلي)
  const proxyChannels = [
    { 
      id: "proxy1", 
      title: "🛡️ BeIN Sport 1 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy2", 
      title: "🛡️ BeIN Sport 2 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy3", 
      title: "🛡️ BeIN Sport 3 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy4", 
      title: "🛡️ BeIN Sport 4 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy5", 
      title: "🛡️ BeIN Sport 5 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy6", 
      title: "🛡️ BeIN Sport 6 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy7", 
      title: "🛡️ BeIN Sport 7 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy8", 
      title: "🛡️ BeIN Sport 8 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
    { 
      id: "proxy9", 
      title: "🛡️ BeIN Sport 9 (Proxy)", 
      category: "sports", 
      quality: "HD", 
      lang: "ar", 
      country: "PROXY",
      type: "proxy" 
    },
  ];

  // جميع القنوات معاً
  const allChannels = [...externalChannels, ...directChannels, ...proxyChannels];

  // دالة الحصول على رابط القناة
  const getChannelUrl = (channel) => {
    switch(channel.type) {
      case "direct":
        return channel.url;
      case "proxy":
        const channelNum = channel.id.replace('proxy', '');
        return `/api/streams/beinsport${channelNum}_.m3u8`;
      case "external":
        return channel.url; // للعرض فقط، سيفتح في نافذة جديدة
      default:
        return "";
    }
  };

  // التصنيفات
  const categories = [
    { id: "all", name: "جميع القنوات", icon: "📺" },
    { id: "sports", name: "رياضة", icon: "⚽" },
    { id: "national", name: "وطنية", icon: "🇩🇿" },
    { id: "movies", name: "أفلام", icon: "🎬" },
    { id: "news", name: "أخبار", icon: "📰" },
    { id: "entertainment", name: "ترفيه", icon: "🍿" },
    { id: "test", name: "اختبار", icon: "🔧" },
  ];

  // تصفية القنوات
  const [category, setCategory] = useState("all");
  const filteredChannels = allChannels.filter(ch => {
    const matchesSearch = search === "" || 
      ch.title.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === "all" || ch.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // تحميل HLS.js ديناميكياً
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js";
    s.async = true;
    s.onload = () => console.log("hls.js loaded");
    s.onerror = () => console.warn("hls.js failed to load");
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  // دالة تشغيل القناة
  async function playChannel(ch) {
    if (ch.type === "external") {
      // القنوات الخارجية تفتح في نافذة جديدة
      const externalWindow = window.open('', '_blank', 'width=1200,height=700,scrollbars=yes');
      
      // إنشاء صفحة HTML كاملة للقناة الخارجية
      const externalPage = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${ch.title} - MISTER-AI-LIVE</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #000;
              color: white;
              font-family: 'Cairo', sans-serif;
              overflow: hidden;
            }
            .header {
              background: linear-gradient(45deg, #FF0000, #FF4500);
              padding: 15px;
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              box-shadow: 0 4px 20px rgba(255, 0, 0, 0.3);
            }
            .video-container {
              width: 100%;
              height: calc(100vh - 70px);
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            video {
              width: 100%;
              height: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            .info {
              position: absolute;
              bottom: 20px;
              left: 20px;
              background: rgba(0,0,0,0.7);
              padding: 10px 20px;
              border-radius: 10px;
              font-size: 14px;
            }
            .loading {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 20px;
              color: #FF4500;
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="header">
            ${ch.title} - جودة: ${ch.quality} - ${ch.country}
          </div>
          <div class="video-container">
            <div class="loading">جاري تحميل القناة الخارجية...</div>
            <video id="externalVideo" controls autoplay playsinline>
              <source src="${ch.url}" type="application/x-mpegURL">
              المتصفح لا يدعم تشغيل هذا النوع من الفيديو.
            </video>
            <div class="info">
              🔴 قناة خارجية - MISTER-AI-LIVE
            </div>
          </div>
          <script>
            const video = document.getElementById('externalVideo');
            
            // محاولة التشغيل مباشرة
            video.play().catch(e => {
              console.log('Auto-play blocked:', e);
            });
            
            // إذا فشل التشغيل، إضافة زر تشغيل
            setTimeout(() => {
              if (video.paused) {
                const playBtn = document.createElement('button');
                playBtn.innerHTML = '🎬 انقر للتشغيل';
                playBtn.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:15px 30px;background:#FF4500;color:white;border:none;border-radius:10px;font-size:18px;cursor:pointer;';
                playBtn.onclick = () => video.play();
                document.querySelector('.video-container').appendChild(playBtn);
              }
            }, 2000);
          <\/script>
        </body>
        </html>
      `;
      
      externalWindow.document.write(externalPage);
      externalWindow.document.close();
      return;
    }

    // القنوات المباشرة والبروكسية تعمل داخل الموقع
    setError("");
    setActive(ch.id);
    const video = videoRef.current;
    if (!video) return;

    try {
      // إيقاف الفيديو الحالي
      video.pause();
      
      // تنظيف HLS القديم
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying HLS:", e);
        }
        hlsRef.current = null;
      }

      const streamUrl = getChannelUrl(ch);
      console.log(`Playing: ${ch.title} - Type: ${ch.type} - URL: ${streamUrl}`);

      // إعداد الفيديو
      video.src = streamUrl;
      video.muted = muted;
      
      // إذا كان MP4، شغله مباشرة
      if (streamUrl.includes('.mp4')) {
        try {
          await video.play();
        } catch (e) {
          console.error("MP4 play error:", e);
          setError("خطأ في تشغيل الفيديو. حاول تفعيل الصوت.");
        }
        return;
      }

      // إذا كان m3u8، استخدم HLS.js أو التشغيل الأصلي
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        try {
          await video.play();
        } catch (e) {
          console.error("Native HLS play error:", e);
          setError("خطأ في تشغيل البث. حاول قناة أخرى.");
        }
      } 
      else if (window.Hls) {
        if (window.Hls.isSupported()) {
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            liveSyncDurationCount: 3,
          });
          
          hlsRef.current = hls;
          
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          
          hls.on(window.Hls.Events.MANIFEST_PARSED, async () => {
            try {
              await video.play();
            } catch (e) {
              console.error("HLS.js play error:", e);
              setError("تعذر تشغيل الفيديو. حاول تفعيل الصوت.");
            }
          });
          
          hls.on(window.Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              setError(`خطأ في البث (${ch.type}). حاول قناة أخرى.`);
            }
          });
        } else {
          setError("المتصفح لا يدعم تشغيل HLS.");
        }
      } else {
        setError("جاري تحميل مشغل الفيديو... انتظر قليلاً.");
      }
    } catch (error) {
      console.error("Error playing channel:", error);
      setError("خطأ غير متوقع. حاول مرة أخرى.");
    }
  }

  // دالة فتح القناة الخارجية فقط (بدون تشغيل داخل الموقع)
  function openExternalChannel(ch) {
    if (ch.type === "external") {
      const externalWindow = window.open('', '_blank', 'width=1200,height=700,scrollbars=yes');
      
      const externalPage = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${ch.title}</title>
          <style>
            body { margin:0; padding:0; background:#000; color:white; font-family:'Cairo',sans-serif; }
            .header { background:linear-gradient(45deg,${ch.color},#FF8C42); padding:15px; text-align:center; font-weight:bold; font-size:18px; }
            .video-container { width:100%; height:calc(100vh - 70px); background:#000; }
            video { width:100%; height:100%; object-fit:contain; }
            .info { position:absolute; bottom:20px; left:20px; background:rgba(0,0,0,0.7); padding:10px 20px; border-radius:10px; font-size:14px; }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="header">${ch.title} | ${ch.quality} | ${ch.country}</div>
          <div class="video-container">
            <video controls autoplay playsinline>
              <source src="${ch.url}" type="application/x-mpegURL">
            </video>
            <div class="info">🔴 قناة خارجية - MISTER-AI-LIVE</div>
          </div>
        </body>
        </html>
      `;
      
      externalWindow.document.write(externalPage);
      externalWindow.document.close();
    }
  }

  function overlayPlay() {
    const ch = active ? allChannels.find(c => c.id === active) : directChannels[0];
    if (ch) playChannel(ch);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  // دالة التكبير الكامل للشاشة
  function toggleFullscreen() {
    const videoContainer = document.querySelector('.video-container');
    
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setFullscreen(false);
    }
  }

  // مراقبة تغييرات وضع الشاشة الكاملة
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // تنظيف HLS عند إغلاق الصفحة
  useEffect(() => {
    return () => {
      try {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>MISTER-AI-LIVE — نظام البث المتكامل</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --bg-dark: #0a0a1a;
            --bg-card: rgba(15, 20, 40, 0.95);
            --primary: #00e0d6;
            --primary-dark: #00b4a9;
            --accent: #ff2a6d;
            --external: #FF4500;
            --direct: #00FF7F;
            --proxy: #FFD700;
            --text: #ffffff;
            --text-secondary: #b0b8d0;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body, #__next {
            min-height: 100vh;
            font-family: 'Cairo', sans-serif;
            background: var(--bg-dark);
            color: var(--text);
            overflow-x: hidden;
          }

          body {
            background: 
              radial-gradient(circle at 20% 30%, rgba(255, 69, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 255, 127, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a1a 0%, #151530 100%);
          }

          /* Header */
          .header {
            padding: 20px 40px;
            background: rgba(10, 10, 26, 0.95);
            backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(255, 69, 0, 0.15);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .logo-icon {
            width: 55px;
            height: 55px;
            background: linear-gradient(135deg, var(--external), var(--direct), var(--proxy));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(255, 69, 0, 0.4);
            animation: glow 3s ease-in-out infinite alternate;
          }

          @keyframes glow {
            from { box-shadow: 0 0 20px rgba(255, 69, 0, 0.4); }
            to { box-shadow: 0 0 40px rgba(0, 255, 127, 0.6); }
          }

          .logo-text {
            font-size: 26px;
            font-weight: 900;
            background: linear-gradient(45deg, var(--external), var(--direct), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }

          .logo-subtext {
            font-size: 13px;
            color: var(--text-secondary);
            margin-top: -2px;
            letter-spacing: 0.5px;
          }

          .system-status {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .status-badge {
            padding: 10px 18px;
            border-radius: 25px;
            font-weight: 800;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s;
            cursor: pointer;
            border: 2px solid transparent;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
          }

          .status-badge:hover {
            transform: translateY(-3px);
          }

          .status-external {
            border-color: var(--external);
            color: var(--external);
          }

          .status-direct {
            border-color: var(--direct);
            color: var(--direct);
          }

          .status-proxy {
            border-color: var(--proxy);
            color: var(--proxy);
          }

          .status-dot {
            width: 10px;
            height: 10px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }

          /* Main Container */
          .container {
            max-width: 1800px;
            margin: 0 auto;
            padding: 35px 25px;
          }

          /* Video Player Section */
          .player-section {
            display: grid;
            grid-template-columns: 2.5fr 1.5fr;
            gap: 35px;
            margin-bottom: 40px;
          }

          @media (max-width: 1200px) {
            .player-section {
              grid-template-columns: 1fr;
            }
          }

          /* Video Container */
          .video-container {
            background: var(--bg-card);
            border-radius: 25px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
            transition: all 0.4s ease;
            position: relative;
          }

          .video-container:fullscreen {
            background: #000;
            border-radius: 0;
            border: none;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .video-wrapper {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background: linear-gradient(45deg, #000, #111);
          }

          .video-wrapper video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10;
          }

          .video-wrapper:hover .video-overlay {
            opacity: 1;
          }

          .play-button {
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid var(--primary);
            transition: all 0.3s;
            backdrop-filter: blur(10px);
          }

          .play-button:hover {
            transform: scale(1.15);
            background: rgba(0, 224, 214, 0.3);
            box-shadow: 0 0 40px rgba(0, 224, 214, 0.5);
          }

          .video-info {
            padding: 25px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
          }

          .channel-info-left {
            flex: 1;
          }

          .channel-name-display {
            font-size: 24px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .channel-meta {
            display: flex;
            align-items: center;
            gap: 20px;
            color: var(--text-secondary);
            font-size: 15px;
          }

          .channel-type-badge {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.5px;
            border: 2px solid;
            transition: all 0.3s;
            background: rgba(0, 0, 0, 0.2);
          }

          .channel-external {
            color: var(--external);
            border-color: var(--external);
          }

          .channel-direct {
            color: var(--direct);
            border-color: var(--direct);
          }

          .channel-proxy {
            color: var(--proxy);
            border-color: var(--proxy);
          }

          .status-dot-active {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          .status-external-dot {
            background: var(--external);
            box-shadow: 0 0 15px var(--external);
          }

          .status-direct-dot {
            background: var(--direct);
            box-shadow: 0 0 15px var(--direct);
          }

          .status-proxy-dot {
            background: var(--proxy);
            box-shadow: 0 0 15px var(--proxy);
          }

          /* Controls */
          .controls {
            display: flex;
            gap: 12px;
            padding: 25px;
            background: rgba(0, 0, 0, 0.25);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            flex-wrap: wrap;
          }

          .control-button {
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.07);
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            letter-spacing: 0.5px;
            flex: 1;
            min-width: 180px;
            justify-content: center;
          }

          .control-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          }

          .control-button.restart {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
          }

          .control-button.mute {
            background: linear-gradient(45deg, #666, #888);
            color: white;
          }

          .control-button.external {
            background: linear-gradient(45deg, var(--external), #FF6347);
            color: white;
            font-weight: 800;
            animation: externalGlow 2s infinite alternate;
          }

          @keyframes externalGlow {
            from { box-shadow: 0 0 15px rgba(255, 69, 0, 0.5); }
            to { box-shadow: 0 0 25px rgba(255, 69, 0, 0.8); }
          }

          .control-button.fullscreen {
            background: linear-gradient(45deg, #4A4A4A, #666);
            color: white;
          }

          /* Channels Panel */
          .channels-panel {
            background: var(--bg-card);
            border-radius: 25px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .panel-header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .panel-title {
            font-size: 22px;
            font-weight: 800;
            color: var(--primary);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .panel-subtitle {
            color: var(--text-secondary);
            font-size: 15px;
            line-height: 1.5;
          }

          /* Search Box */
          .search-container {
            position: relative;
            margin-bottom: 20px;
          }

          .search-input {
            width: 100%;
            padding: 18px 25px 18px 60px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(0, 224, 214, 0.15);
            border-radius: 18px;
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-size: 17px;
            transition: all 0.3s;
            font-weight: 500;
          }

          .search-input:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 30px rgba(0, 224, 214, 0.15);
          }

          .search-icon {
            position: absolute;
            left: 25px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--primary);
            font-size: 20px;
          }

          /* Categories */
          .categories {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 20px;
            margin-bottom: 20px;
            scrollbar-width: thin;
          }

          .category-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text);
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            border: 2px solid transparent;
          }

          .category-btn:hover {
            background: rgba(0, 224, 214, 0.1);
            border-color: rgba(0, 224, 214, 0.3);
          }

          .category-btn.active {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
            box-shadow: 0 8px 25px rgba(0, 224, 214, 0.25);
            border-color: transparent;
          }

          /* Channels Grid */
          .channels-grid-container {
            flex: 1;
            overflow: hidden;
          }

          .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 15px;
            max-height: 500px;
            overflow-y: auto;
            padding-right: 10px;
          }

          .channel-item {
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.4s;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
          }

          .channel-item:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          }

          .channel-item.active {
            border-color: var(--primary);
            box-shadow: 0 20px 40px rgba(0, 224, 214, 0.15);
            background: rgba(0, 224, 214, 0.03);
          }

          .channel-item.external {
            border-left: 5px solid var(--external);
          }

          .channel-item.direct {
            border-left: 5px solid var(--direct);
          }

          .channel-item.proxy {
            border-left: 5px solid var(--proxy);
          }

          .channel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .channel-type-indicator {
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 900;
            font-size: 12px;
            letter-spacing: 0.5px;
            border: 2px solid;
          }

          .external-indicator {
            background: rgba(255, 69, 0, 0.15);
            color: var(--external);
            border-color: var(--external);
          }

          .direct-indicator {
            background: rgba(0, 255, 127, 0.15);
            color: var(--direct);
            border-color: var(--direct);
          }

          .proxy-indicator {
            background: rgba(255, 215, 0, 0.15);
            color: var(--proxy);
            border-color: var(--proxy);
          }

          .channel-name {
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 10px;
            color: var(--text);
            line-height: 1.4;
            min-height: 45px;
          }

          .channel-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
          }

          .channel-quality {
            background: rgba(255, 42, 109, 0.2);
            color: #ff6b9d;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 12px;
          }

          .channel-country {
            font-size: 11px;
            color: var(--text-secondary);
            background: rgba(255, 255, 255, 0.05);
            padding: 4px 10px;
            border-radius: 10px;
          }

          .channel-action-buttons {
            display: flex;
            gap: 8px;
            margin-top: 15px;
          }

          .action-button {
            flex: 1;
            padding: 10px 15px;
            border: none;
            border-radius: 12px;
            font-family: 'Cairo', sans-serif;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            letter-spacing: 0.5px;
          }

          .external-button {
            background: linear-gradient(45deg, var(--external), #FF6347);
            color: white;
          }

          .play-button-small {
            background: linear-gradient(45deg, var(--primary), var(--primary-dark));
            color: #001217;
          }

          .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          }

          /* Error Message */
          .error-message {
            background: rgba(255, 42, 109, 0.15);
            border: 2px solid var(--accent);
            color: #ffb8d0;
            padding: 20px;
            border-radius: 15px;
            margin: 25px 0;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(255, 42, 109, 0.1);
          }

          /* Success Message */
          .success-message {
            background: linear-gradient(45deg, rgba(0, 224, 214, 0.1), rgba(255, 69, 0, 0.05));
            border: 2px solid rgba(0, 224, 214, 0.3);
            color: var(--primary);
            padding: 20px;
            border-radius: 15px;
            margin: 25px 0;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.6;
            box-shadow: 0 10px 30px rgba(0, 224, 214, 0.1);
          }

          /* Stats */
          .stats {
            display: flex;
            justify-content: center;
            gap: 25px;
            margin-top: 20px;
            font-size: 14px;
            flex-wrap: wrap;
          }

          .stat-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s;
          }

          .stat-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            box-shadow: 0 0 15px currentColor;
          }

          .stat-dot.external {
            background: var(--external);
            animation: externalGlow 2s infinite alternate;
          }

          .stat-dot.direct {
            background: var(--direct);
            animation: pulse 2s infinite;
          }

          .stat-dot.proxy {
            background: var(--proxy);
            animation: pulse 2s infinite;
          }

          /* Footer */
          .footer {
            text-align: center;
            padding: 35px 25px;
            margin-top: 60px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            color: var(--text-secondary);
            font-size: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 25px;
            backdrop-filter: blur(10px);
          }

          .footer-logo {
            color: var(--primary);
            font-weight: 900;
            margin-bottom: 15px;
            font-size: 22px;
            letter-spacing: 1px;
          }

          .footer-text {
            opacity: 0.8;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
          }

          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, var(--primary), var(--external));
            border-radius: 10px;
          }

          /* Responsive */
          @media (max-width: 1400px) {
            .channels-grid {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            }
          }

          @media (max-width: 1024px) {
            .header {
              padding: 15px 25px;
              flex-direction: column;
              gap: 20px;
            }

            .system-status {
              width: 100%;
              justify-content: center;
            }

            .container {
              padding: 25px 15px;
            }

            .channels-grid {
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }

            .control-button {
              min-width: 150px;
            }
          }

          @media (max-width: 768px) {
            .logo-text {
              font-size: 22px;
            }

            .status-badge {
              padding: 8px 15px;
              font-size: 13px;
            }

            .control-button {
              min-width: 100%;
              font-size: 14px;
              padding: 12px 20px;
            }

            .channels-grid {
              grid-template-columns: 1fr;
            }

            .categories {
              flex-wrap: wrap;
            }

            .category-btn {
              padding: 10px 15px;
              font-size: 13px;
            }
          }

          @media (max-width: 480px) {
            .header {
              padding: 15px;
            }

            .logo-text {
              font-size: 20px;
            }

            .channel-name {
              font-size: 14px;
            }

            .footer {
              padding: 25px 15px;
            }
          }
        `}</style>
      </Head>

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#001217"/>
              <path d="M2 17L12 22L22 17" stroke="#001217" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="#001217" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">MISTER-AI-LIVE</div>
            <div className="logo-subtext">نظام البث المتكامل - خارجي + مباشر + بروكسي</div>
          </div>
        </div>
        <div className="system-status">
          <div className="status-badge status-external" onClick={() => setCategory('sports')}>
            <div className="status-dot"></div>
            <span>خارجي: {externalChannels.length}</span>
          </div>
          <div className="status-badge status-direct" onClick={() => setCategory('movies')}>
            <div className="status-dot"></div>
            <span>مباشر: {directChannels.length}</span>
          </div>
          <div className="status-badge status-proxy" onClick={() => setShowAllChannels(true)}>
            <div className="status-dot"></div>
            <span>بروكسي: {proxyChannels.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="player-section">
          {/* Video Player */}
          <div className="video-container">
            <div className="video-wrapper">
              <video 
                ref={videoRef} 
                controls 
                playsInline 
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%" }}
              />
              <div className="video-overlay" onClick={overlayPlay}>
                <div className="play-button">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="video-info">
              <div className="channel-info-left">
                <div className="channel-name-display">
                  {active ? allChannels.find(c => c.id === active)?.title : "اختر قناة للبدأ"}
                </div>
                <div className="channel-meta">
                  {active && (
                    <>
                      <span className={`channel-type-badge ${
                        allChannels.find(c => c.id === active)?.type === 'external' ? 'channel-external' :
                        allChannels.find(c => c.id === active)?.type === 'direct' ? 'channel-direct' : 'channel-proxy'
                      }`}>
                        {allChannels.find(c => c.id === active)?.type === 'external' ? '📡 خارجي' :
                         allChannels.find(c => c.id === active)?.type === 'direct' ? '🔗 مباشر' : '🛡️ بروكسي'}
                      </span>
                      <span>{allChannels.find(c => c.id === active)?.quality}</span>
                      <span>{allChannels.find(c => c.id === active)?.lang?.toUpperCase()}</span>
                      <span className="channel-country">{allChannels.find(c => c.id === active)?.country}</span>
                      <div className={`status-dot-active ${
                        allChannels.find(c => c.id === active)?.type === 'external' ? 'status-external-dot' :
                        allChannels.find(c => c.id === active)?.type === 'direct' ? 'status-direct-dot' : 'status-proxy-dot'
                      }`}></div>
                      <span>{active ? "جاري التشغيل" : "متوقف"}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="controls">
              <button className="control-button restart" onClick={() => {
                const ch = active ? allChannels.find(c => c.id === active) : directChannels[0];
                if (ch) playChannel(ch);
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                إعادة تشغيل
              </button>

              <button className="control-button mute" onClick={toggleMute}>
                {muted ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                    إلغاء الكتم
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    كتم الصوت
                  </>
                )}
              </button>

              <button className="control-button external" onClick={() => {
                const ch = active ? allChannels.find(c => c.id === active) : externalChannels[0];
                if (ch && ch.type === 'external') {
                  openExternalChannel(ch);
                } else {
                  // افتح أول قناة خارجية
                  openExternalChannel(externalChannels[0]);
                }
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                فتح خارجياً
              </button>

              <button className="control-button fullscreen" onClick={toggleFullscreen}>
                {fullscreen ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                    خروج
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    شاشة كاملة
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channels Panel */}
          <div className="channels-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>📡</span>
                القنوات المتاحة ({filteredChannels.length})
              </div>
              <div className="panel-subtitle">
                اختر قناة: 📡 خارجية (نافذة جديدة) | 🔗 مباشرة داخل الموقع | 🛡️ عبر بروكسي
              </div>
            </div>

            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="ابحث عن قناة رياضية، جزائرية، أفلام..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Channels Grid */}
            <div className="channels-grid-container">
              <div className="channels-grid">
                {filteredChannels.map((ch) => (
                  <div
                    key={ch.id}
                    className={`channel-item ${ch.type} ${active === ch.id ? 'active' : ''}`}
                  >
                    <div className="channel-header">
                      <span className={`channel-type-indicator ${
                        ch.type === 'external' ? 'external-indicator' :
                        ch.type === 'direct' ? 'direct-indicator' : 'proxy-indicator'
                      }`}>
                        {ch.type === 'external' ? '📡 خارجي' : 
                         ch.type === 'direct' ? '🔗 مباشر' : '🛡️ بروكسي'}
                      </span>
                      <span className="channel-country">{ch.country}</span>
                    </div>
                    
                    <div className="channel-name">
                      {ch.title}
                    </div>
                    
                    <div className="channel-details">
                      <span className="channel-quality">{ch.quality}</span>
                      <span>{ch.lang?.toUpperCase()}</span>
                    </div>
                    
                    <div className="channel-action-buttons">
                      {ch.type === 'external' ? (
                        <button 
                          className="action-button external-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openExternalChannel(ch);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                          </svg>
                          فتح خارجياً
                        </button>
                      ) : (
                        <button 
                          className="action-button play-button-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            playChannel(ch);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          تشغيل داخلي
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="success-message">
          🚀 <strong>نظام البث المتكامل:</strong> 
          <br />
          📡 <strong>القنوات الخارجية (ottv.pro):</strong> {externalChannels.length} قناة - تفتح في نافذة جديدة
          <br />
          🔗 <strong>القنوات المباشرة (Rakuten):</strong> {directChannels.length} قناة - تعمل داخل الموقع بدون بروكسي
          <br />
          🛡️ <strong>القنوات البروكسية:</strong> {proxyChannels.length} قناة - تعمل داخل الموقع عبر بروكسي
        </div>

        <div className="stats">
          <div className="stat-item">
            <div className="stat-dot external"></div>
            <span>قنوات خارجية: {externalChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot direct"></div>
            <span>قنوات مباشرة: {directChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot proxy"></div>
            <span>قنوات بروكسي: {proxyChannels.length}</span>
          </div>
          <div className="stat-item">
            <div className="stat-dot external"></div>
            <span>إجمالي: {allChannels.length} قناة</span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-logo">MISTER-AI-LIVE</div>
        <div className="footer-text">
          © 2026 MISTERAI LIVE — نظام البث المتكامل المتطور
          <br />
          <small>دمج جميع أنواع القنوات في نظام واحد متكامل</small>
          <br />
          <small>📡 قنوات ottv.pro تفتح خارجياً | 🔗 قنوات Rakuten تعمل مباشرة | 🛡️ قنوات البروكسي تعمل داخل النظام</small>
        </div>
      </footer>
    </>
  );
}
