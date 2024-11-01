import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const supportedLanguages = {
	en: "🇬🇧 English",
	es: "🇪🇸 Español",
	fr: "🇫🇷 Français",
	pt: "🇵🇹 Português",
	am: "🇪🇹 አማርኛ",
	yo: "🇳🇬 Yorùbá",
};
export const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
const youtubeOpts = "?rel=0&autoplay=1";
const whatsappMapsUrl =
	"https://uclexcites.blog/2024/06/26/whatsapp-maps-connecting-users-and-producers-of-ground-information/";
const extremeCitizenUrl = "https://www.youtube.com/watch?v=IgQc7GQ1m_Y";
const marcosUrl =
	"https://www.ucl.ac.uk/geography/people/research-staff/marcos-moreu";
const fabienUrl = "https://www.ucl.ac.uk/geography/fabien-moustard";
const tomUrl =
	"https://www.ucl.ac.uk/advanced-research-computing/people/tom-couch";
const mukiUrl = "https://www.ucl.ac.uk/geography/muki-haklay-facss";
const jonathanUrl =
	"https://www.ucl.ac.uk/advanced-research-computing/people/jonathan-cooper";
const claireUrl =
	"https://www.ucl.ac.uk/civil-environmental-geomatic-engineering/people/dr-claire-ellul";
const amandaUrl =
	"https://www.ucl.ac.uk/advanced-research-computing/people/amanda-ho-lyn";
const jedUrl = "https://www.durham.ac.uk/staff/jed-stevenson/";
const desUrl = "https://et.linkedin.com/in/dessalegn-tekle-02b848ba";

i18next.use(initReactI18next).init({
	lng: savedLanguage,
	fallbackLng: ["en", "es", "fr", "pt", "am", "yo"],
	supportedLngs: Object.keys(supportedLanguages),
	debug: true,
	resources: {
		en: {
			translation: {
				key: "hello world",
				asktheteam: "Ask us anything",
				instructions: `<span class="title">Create WhatsApp Maps with Kapta </span><hr> 1 - Share locations in a WhatsApp group<br> 2 - Export chat to Kapta<br> 3 - Share your WhatsApp Map`,
				watchtutorial: "Watch tutorial",
				tutorialUrl: "https://youtube.com/embed/vaPHy8S-OpA" + youtubeOpts,
				viewrecentmap: "View recent map",
				showmap: "Show map",
				selectFile: "Convert WhatsApp chat to map",
				observer: "Observer",
				date: "Date",
				inputtopiclabel: "What have you mapped in this WhatsApp group?",
				inputgoallabel: "What do you want to achieve with this map?",
				datasovmessage:
					"Do you allow the Kapta team to use your map to support your community?",
				about: "About",
				aboutContent: `Kapta Mobile is a Progressive Web App to create WhatsApp Maps in 3 steps. <br><br><b>Why Kapta?<b><br><br>To connect users and producers of ground information. See our latest blog and where this started in 2010:<br><li><a href='${whatsappMapsUrl}'>WhatsApp Maps? Connecting users and producers of ground information</a></li><br><li><a href='${extremeCitizenUrl}'>Extreme Citizen Science in the Congo rainforest</a></li><br><em> <br><br><b>What's next?<b><br><br>Kapta:A (de)centralised crowdsourcing system to connect users and producers of ground information.</em>`,
				people: "People",
				peopleContent: `Kapta is being developed by the University College London (UCL) Extreme Citizen Science (ExCiteS) research group and the Advanced Research Computing Centre (UCL ARC), with help from outside partners & contributors.<br>Currently the core Kapta team consists of:<br><ul><li><a href='${marcosUrl}'>Marcos Moreu, UCL Geography</a></li><li><a href='${fabienUrl}'>Fabien Moustard, UCL Geography</a></li><li><a href='${tomUrl}'>Tom Couch, UCL ARC</a></li><li><a href='${mukiUrl}'>Muki Haklay, UCL Geography</a></li><li><a href='${jonathanUrl}'>Jonathan Cooper, UCL ARC</a></li><li><a href='${claireUrl}'>Claire Ellul, UCL CEGE</a></li><li><a href='${amandaUrl}'>Amanda Ho-Lyn, UCL ARC</a></li><li><a href='${jedUrl}'>Jed Stevenson, Durham University</a></li><li><a href='${desUrl}'>Dessalegn Teckle, Addis Ababa University, NGO IPC</a></li></ul>`,
				legalDisclaimer: "Disclaimer: The Kapta team has made every effort to develop an app that parse WhatsApp chats to create WhatsApp Maps with the highest possible accuracy. However, we cannot accept responsibility for any errors, omissions, or inconsistencies that may occur. Please always make your own judgement about the accuracy of the maps and validate the information using other sources. If you encounter any issues or have feedback, please reach out to us at geog.excites@ucl.ac.uk or via WhatsApp at +34 678380944.",
				confirm: "Confirm",
				yes: "Yes",
				no: "No",
				sharedata: "Share the map DATA",
				shareimg: "Share the map IMAGE",
				uploaddata: "Upload to Kapta Web",
				addMetadataTitle: "Describe this map",
				sharingTitle: "Share this map",
				addDescription: "Add a title to your map",
				updateDescription: "Update map title",
				copyright: "Kapta by UCL",
				supportOption: "Get support to improve your map",
				installPrompt: "Install Kapta to create WhatsApp Maps",
				installClickMessage:
					"Kapta is now being added to your home screen. This might take a few seconds",
				desktoporiosPrompt:
					"Kapta works best on Android mobile devices. Please visit this page on an Android mobile device to use the app.",
				install: "Install",
				dismiss: "Dismiss",
			},
		},
		es: {
			translation: {
				key: "hola mundo",
				asktheteam: "Pregúntanos lo que quieras",
				instructions: `<span class="title">Crea WhatsApp Maps con Kapta</span><hr>1 - Comparte ubicaciones en un grupo de WhatsApp<br>2 - Exporta el chat a Kapta<br>3 - Comparte tu WhatsApp Map`,
				watchtutorial: "Ver tutorial",
				tutorialUrl: "https://youtube.com/embed/hq2h8Ou2BOE" + youtubeOpts,
				viewrecentmap: "Ver mapa reciente",
				showmap: "Mostrar mapa",
				selectFile: "Convertir chat de WhatsApp a mapa",
				observer: "Observador",
				date: "Fecha",
				datasovmessage:
					"¿Permites que el equipo de Kapta use tu mapa para apoyar a tu comunidad?",
				inputtopiclabel: "¿Qué has mapeado en este grupo de WhatsApp?",
				inputgoallabel: "¿Qué deseas lograr con este mapa?",
				about: "Qué es Kapta?",
				aboutContent: `Kapta Mobile es una app para crear WhatsApp Maps en 3 pasos. <br><br><b>¿Por qué Kapta?<b><br><br>Para popularizar el mapeo y conectar usuarios y productores de información de campo. Consulta nuestro último blog y dónde empezó esto en 2010:<br><li><a href='${whatsappMapsUrl}'>¿Mapas de WhatsApp? Conectando usuarios y productores de información de campo</a></li><br><li><a href='${extremeCitizenUrl}'>Ciencia Ciudadana Extrema en la selva tropical del Congo</a></li><br><em> <br><br><b>Qué sigue?<b><br><br>Kapta: Un sistema (des)centralizado de crowdsourcing para conectar a usuarios y productores de información de terreno.</em>`,
				people: "Quiénes Somos",
				peopleContent: `Kapta está siendo desarrollado por el grupo de investigación de Ciencia Ciudadana Extrema (UCL ExCiteS) y el Centro de Computación Avanzada (UCL ARC) de la University College London (UCL), con ayuda de socios externos y colaboradores.<br>Actualmente, el equipo central de Kapta está formado por: <br><ul><li><a href='${marcosUrl}'>Marcos Moreu, UCL Geography</a></li><li><a href='${fabienUrl}'>Fabien Moustard, UCL Geography</a></li><li><a href='${tomUrl}'>Tom Couch, UCL ARC</a></li><li><a href='${mukiUrl}'>Muki Haklay, UCL Geography</a></li><li><a href='${jonathanUrl}'>Jonathan Cooper, UCL ARC</a></li><li><a href='${claireUrl}'>Claire Ellul, UCL CEGE</a></li><li><a href='${amandaUrl}'>Amanda Ho-Lyn, UCL ARC</a></li><li><a href='${jedUrl}'>Jed Stevenson, Durham University</a></li><li><a href='${desUrl}'>Dessalegn Teckle, Addis Ababa University, NGO IPC</a></li></ul>`,
				legalDisclaimer: "Exención de responsabilidad: El equipo de Kapta ha hecho todo lo posible para desarrollar una aplicación que procesa chats de WhatsApp para crear WhatsApp Maps con la mayor precisión posible. Sin embargo, no podemos aceptar responsabilidad por errores, omisiones o inconsistencias que puedan ocurrir. Le recomendamos que siempre haga su propio juicio sobre la precisión de los mapas y valide la información utilizando otras fuentes. Si encuentra algún problema o tiene comentarios, comuníquese con nosotros en geog.excites@ucl.ac.uk o a través de WhatsApp en el +34 678380944.",
				confirm: "Confirmar",
				yes: "Sí",
				no: "No",
				sharedata: "Compartir los DATOS del mapa",
				shareimg: "Comparte el mapa",
				uploaddata: "Subir a Kapta Web",
				addMetadataTitle: "Describe este mapa",
				sharingTitle: "Comparte este mapa",
				cancel: "cancel",
				addDescription: "Título del mapa",
				updateDescription: "Cambia el título",
				copyright: "Kapta por UCL",
				supportOption: "Ayuda para mejorar el mapa?",
				installPrompt: "Instalar Kapta para crear WhatsApp Maps",
				installClickMessage:
					"Kapta se está añadiendo a tu pantalla de inicio. Esto puede tardar unos segundos.",
				desktoporiosPrompt:
					"Kapta funciona mejor en dispositivos móviles Android. Por favor, visite esta página en un dispositivo móvil para usar la aplicación.",
				install: "Instalar",
				dismiss: "No Instalar",
			},
		},
		fr: {
			translation: {
				key: "bonjour le monde",
				asktheteam: "Demandez-nous ce que vous voulez",
				instructions: `<span class="title">Créer des WhatsApp Maps avec Kapta</span><hr>1 - Partagez des localisations dans un groupe WhatsApp<br>2 - Exportez la discussion dans Kapta<br>3 - Partagez votre WhatsApp Map`,
				watchtutorial: "Regarder le tutoriel",
				tutorialUrl: "https://youtube.com/embed/3KrsKgFHYMs" + youtubeOpts,
				viewrecentmap: "Voir la carte récente",
				showmap: "Afficher la carte",
				selectFile: "Convertir la discussion WhatsApp en carte",
				observer: "Observateur",
				date: "Date",
				inputtopiclabel: "Qu’avez-vous cartographié dans ce groupe WhatsApp?",
				inputgoallabel: "Que souhaitez-vous faire avec cette carte?",
				datasovmessage:
					"Autorisez-vous l’équipe Kapta à utiliser votre carte pour soutenir votre communauté?",
				about: "À propos",
				aboutContent: `Kapta Mobile est une application web progressive pour créer des Cartes WhatsApp en 3 étapes. <br>Pourquoi?<br>Pour connecter les utilisateurs et les producteurs d'informations de terrain. Consultez notre dernier blog et découvrez où tout a commencé en 2010:<br><li><a href='${whatsappMapsUrl}'>Cartes WhatsApp ? Connecter utilisateurs et producteurs d'informations de terrain</a></li><br><li><a href='${extremeCitizenUrl}'>Science Citoyenne Extrême dans la forêt tropicale du Congo</a></li><br><em>Kapta : Un système de crowdsourcing (dé)centralisé pour connecter les utilisateurs et les producteurs d'informations sur le terrain.</em>`,
				people: "Personnes",
				peopleContent: `Kapta est développé par le groupe de recherche Science Citoyenne Extrême (ExCiteS) de l'University College London (UCL) et le Centre de Calcul Avancé (UCL ARC), avec l'aide de partenaires externes et de contributeurs.<br>Actuellement, l'équipe centrale de Kapta se compose de:<br><ul><li><a href='${marcosUrl}'>Marcos Moreu, UCL Géographie</a></li><li><a href='${fabienUrl}'>Fabien Moustard, UCL Géographie</a></li><li><a href='${tomUrl}'>Tom Couch, UCL ARC</a></li><li><a href='${mukiUrl}'>Muki Haklay, UCL Géographie</a></li><li><a href='${jonathanUrl}'>Jonathan Cooper, UCL ARC</a></li><li><a href='${claireUrl}'>Claire Ellul, UCL CEGE</a></li><li><a href='${amandaUrl}'>Amanda Ho-Lyn, UCL ARC</a></li><li><a href='${jedUrl}'>Jed Stevenson, Université de Durham</a></li><li><a href='${desUrl}'>Dessalegn Teckle, Université d'Addis-Abeba, ONG IPC</a></li></ul>`,
				legalDisclaimer: "Avertissement juridique : L'équipe de Kapta a fait tout son possible pour développer une application qui analyse les discussions WhatsApp afin de créer des WhatsApp Maps avec la plus grande précision possible. Cependant, nous ne pouvons accepter aucune responsabilité pour les erreurs, omissions ou incohérences qui pourraient survenir. Nous vous recommandons de toujours juger par vous-même de l'exactitude des cartes et de valider les informations en utilisant d'autres sources. Si vous rencontrez des problèmes ou avez des commentaires, veuillez nous contacter à geog.excites@ucl.ac.uk ou via WhatsApp au +34 678380944.",
				confirm: "Confirmer",
				yes: "Oui",
				no: "Non",
				sharedata: "Partager les données",
				shareimg: "Partager une photo",
				uploaddata: "Télécharger sur Kapta Web",
				addMetadataTitle: "Décrivez cette carte",
				sharingTitle: "Partager cette carte",
				addDescription: "Ajoutez un titre",
				updateDescription: "Changer le titre",
				copyright: "Kapta par UCL",
				supportOption: "Aide pour améliorer votre carte",
				installPrompt: "Installez Kapta pour créer WhatsApp Maps",
				installClickMessage:
					"Kapta est maintenant ajouté à votre écran d'accueil. Cela peut prendre quelques secondes",
				desktoporiosPrompt:
					"Kapta fonctionne mieux sur les appareils mobiles Android. Veuillez visiter cette page sur un appareil mobile pour utiliser l'application.",
				install: "Installer",
				dismiss: "Rejeter",
			},
		},
		am: {
			translation: {
				key: "አንደትናት ዓለም",
				asktheteam: "ምንም ጥያቄ ጠይቁን",
				instructions: `<span class="title">በካፕታ መተግብሪያ ዋትስ አፕ ካርታን ይስሩ</span><hr>1 - አከባቢውን ያጋሩ<br>2 - ምልልሱን ወደካፕታ ይላኩ<br>3 - የዋትስ አፕ ካርታዎን ያጋሩ`,
				watchtutorial: "አጋዥ ስልጠናን ይመልከቱ",
				tutorialUrl: "https://youtube.com/embed/vaPHy8S-OpA" + youtubeOpts,
				viewrecentmap: "የቅርብ ጊዜ ካርታ ይመልከቱ",
				showmap: "ካርታ አሳይ",
				selectFile: "የዋትስአፕ ውይይትን ወደ ካርታ ለውጥ",
				observer: "ተመልካች",
				date: "ቀን",
				inputtopiclabel: "በዚህ ዋትስአፕ ቡድን ምን አሳፍረክ?",
				inputgoallabel: "በዚህ ካርታ ምን ማንኛት ነገር ልታከናውን ትፈልጋለህ?",
				datasovmessage: "በኮምዩኒቲዎ ማገዶ እንዲረዳዎ ካፕታ ቡድን ካርታዎን ማጠቃለያን ትፈቅድለታለህ?",
				about: "ስለ",
				aboutContent: `Kapta ሞባይል ሶፍትዌር የእንቅስቃሴ ድህረ-ገጽ (Progressive Web App) ነው። በ3 ሰለስተኛ ደረጃዎች የWhatsApp ካርታዎችን ለመፍጠር ይህን ይጠቀሙ።<br>ለምን?<br>ተጠቃሚዎችንና ባህርይ መረጃ እንደ ስርዓተ-አቀጣጠር በሚፈጸም ሂደት በመሳተፍ ይጠናቀቃል። ያንንም በውስጥ ካልተጠቀሙ ምልክቶች ይኸው:<br><li><a href='${whatsappMapsUrl}'>WhatsApp ካርታዎች? ተጠቃሚዎችንና ባህርይ መረጃ አቅራቢዎችን በማገናኘት</a></li><br><li><a href='${extremeCitizenUrl}'>አበሻ ሲቲዘን ሳይንስ በኮንጎ የዱር ጫካ</a></li><br><em>ካፕታ: እንደሆነ ተመሳሳይ እንደሆነ የአምባገኝ ስርዓት ተጠቃሚዎችን እና የመሬት መረጃ አምራቾችን ለማገናኘት ።</em>`,
				people: "ሰዎች",
				peopleContent: `Kapta በአውሮፕያን ዩኒቨርሲቲ (University College London, UCL) Extreme Citizen Science (ExCiteS) መሪ እና ከአውጪዎች ባለሙያዎች በተባባሉ እንደሚገናኙና እንዲቀላቀሉ እንገናኝ እንደምንሳቸው።<br>በአሁኑ ወቅት የKapta ዋና ቡድን የሚካተቱበት:<br><ul><li><a href='${marcosUrl}'>ማርኮስ ሞሬኡ, በUCL ጂዮግራፊ</a></li><li><a href='${fabienUrl}'>ፋቢዬን ሞስታርድ, በUCL ጂዮግራፊ</a></li><li><a href='${tomUrl}'>ቶም ካኡኽ, በUCL ARC</a></li><li><a href='${mukiUrl}'>ሙኪ ሃክላይ, በUCL ጂዮግራፊ</a></li><li><a href='${jonathanUrl}'>ጆናታን ኮኡፐር, በUCL ARC</a></li><li><a href='${claireUrl}'>ክሌር ኤሉል, በUCL CEGE</a></li><li><a href='${amandaUrl}'>አማንዳ ሆ-ሊን, በUCL ARC</a></li><li><a href='${jedUrl}'>ጄድ ስቴቭንሰን, በደርሀም ዩኒቨርሲቲ</a></li><li><a href='${desUrl}'>ዴሰሌን ትክሌ, አዲስ አበባ ዩኒቨርሲቲ, ማህበረሰብ IPC</a></li></ul>`,
				legalDisclaimer: "Disclaimer: The Kapta team has made every effort to develop an app that parse WhatsApp chats to create WhatsApp Maps with the highest possible accuracy. However, we cannot accept responsibility for any errors, omissions, or inconsistencies that may occur. Please always make your own judgement about the accuracy of the maps and validate the information using other sources. If you encounter any issues or have feedback, please reach out to us at geog.excites@ucl.ac.uk or via WhatsApp at +34 678380944.",
				confirm: "አረጋግጥ",
				yes: "አዎን",
				no: "አይደለም",
				sharedata: "መረጃወን ያጋሩ",
				shareimg: "ምስል ያጋሩ",
				uploaddata: "ወደ ካፕታ ይጫኑ።",
				addMetadataTitle: "ይህን መረጃ አርእስት ይስጡት",
				sharingTitle: "ይህን አረእስት ያጋሩ",
				addDescription: "በካርታዎ ላይ ዝርዝር ይክሉ",
				updateDescription: "የካርታ ዝርዝሩን ያዘምኑ",
				copyright: "ካፕታ በ UCL",
				supportOption: "ካርታዎን ለማሻሻል ድጋፍ አማራጭ",
				installPrompt: "ካፕታ በሞባይል መሳሪያ ላይ ሲጫኑ በተሻለ ሁኔታ ይሰራል. አሁን ይጫኑ?",
				installClickMessage:
					"ካፕታ አሁን ወደ መነሻ ስክሪንዎ እየታከለ ነው። ይሄ ጥቂት ሰከንዶች ሊወስድ ይችላል።",
				desktoporiosPrompt:
					"ካፕታ በአንድሮይድ ሞባይል መሳሪያዎች ላይ በተሻለ ሁኔታ ይሰራል። እባክዎን መተግበሪያውን ለመጠቀም ይህን ገጽ በሞባይል መሳሪያ ላይ ይጎብኙ።",
				install: "ጫን",
				dismiss: "አስወግድ",
			},
		},
		pt: {
			translation: {
				key: "olá mundo",
				asktheteam: "Pergunte-nos qualquer coisa",
				instructions: `<span class="title">Crie Mapas do WhatsApp com o Kapta</span><hr>1 - Partilhe locais num grupo do WhatsApp<br> 2 - Exporte o chat para o Kapta<br> 3 - Compartilhe seu WhatsApp Map`,
				watchtutorial: "Assistir tutorial",
				tutorialUrl: "https://youtube.com/embed/vaPHy8S-OpA" + youtubeOpts,
				viewrecentmap: "Ver mapa recente",
				showmap: "Mostrar mapa",
				selectFile: "Converter conversa do WhatsApp em mapa",
				observer: "Observador",
				date: "Data",
				inputtopiclabel: "O que você mapeou neste grupo de WhatsApp?",
				inputgoallabel: "O que você quer alcançar com este mapa?",
				datasovmessage:
					"Você permite que a equipe Kapta use seu mapa para apoiar sua comunidade?",
				about: "Sobre",
				aboutContent: `Kapta Mobile é uma Aplicação Web Progressiva para criar Mapas WhatsApp em 3 passos. <br>Porquê?<br>Para conectar utilizadores e produtores de informação de campo. Veja o nosso último blog e onde tudo começou em 2010:<br><li><a href='${whatsappMapsUrl}'>Mapas WhatsApp? Conectando utilizadores e produtores de informação de campo</a></li><br><li><a href='${extremeCitizenUrl}'>Ciência Cidadã Extrema na floresta tropical do Congo</a></li><br><em>Kapta: Um sistema (des)centralizado de crowdsourcing para conectar usuários e produtores de informações de campo.</em>`,
				people: "Pessoas",
				peopleContent: `Kapta está a ser desenvolvido pelo grupo de pesquisa Ciência Cidadã Extrema (ExCiteS) da University College London (UCL) e pelo Centro de Computação Avançada (UCL ARC), com ajuda de parceiros externos e colaboradores.<br>Atualmente, a equipa principal do Kapta consiste em:<br><ul><li><a href='${marcosUrl}'>Marcos Moreu, Geografia UCL</a></li><li><a href='${fabienUrl}'>Fabien Moustard, Geografia UCL</a></li><li><a href='${tomUrl}'>Tom Couch, UCL ARC</a></li><li><a href='${mukiUrl}'>Muki Haklay, Geografia UCL</a></li><li><a href='${jonathanUrl}'>Jonathan Cooper, UCL ARC</a></li><li><a href='${claireUrl}'>Claire Ellul, UCL CEGE</a></li><li><a href='${amandaUrl}'>Amanda Ho-Lyn, UCL ARC</a></li><li><a href='${jedUrl}'>Jed Stevenson, Universidade de Durham</a></li><li><a href='${desUrl}'>Dessalegn Teckle, Universidade de Addis Abeba, ONG IPC</a></li></ul>`,
				legalDisclaimer: "Aviso Legal: A equipe Kapta fez todo o possível para desenvolver um aplicativo que analisa conversas do WhatsApp para criar WhatsApp Maps com a maior precisão possível. No entanto, não podemos aceitar responsabilidade por erros, omissões ou inconsistências que possam ocorrer. Recomendamos que você sempre faça seu próprio julgamento sobre a precisão dos mapas e valide as informações usando outras fontes. Se encontrar algum problema ou tiver comentários, entre em contato conosco pelo e-mail geog.excites@ucl.ac.uk ou pelo WhatsApp no número +34 678380944.",
				confirm: "Confirmar",
				yes: "Sim",
				no: "Não",
				sharedata: "Compartilhar os dados do mapa",
				shareimg: "Compartilhar a imagem do mapa",
				uploaddata: "Carregar para a Web Kapta",
				addMetadataTitle: "Descreva este mapa",
				sharingTitle: "Compartilhar este mapa",
				addDescription: "Título do seu mapa",
				updateDescription: "Alterar o título do mapa",
				copyright: "Kapta pela UCL",
				supportOption: "Obtenha suporte para melhorar seu mapa",
				installPrompt: "Instale o Kapta para criar WhatsApp Maps",
				installClickMessage:
					"Kapta está agora a ser adicionado à sua tela inicial. Isto pode levar alguns segundos",
				desktoporiosPrompt:
					"O Kapta funciona melhor em dispositivos móveis Android. Por favor, visite esta página num dispositivo móvel para usar a aplicação.",
				install: "Instalar",
				dismiss: "Dispensar",
			},
		},
		yo: {
			translation: {
				key: "báwo ni ayé",
				asktheteam: "Béèrè ohunkóhun lọ́wọ́ wa",
				instructions: `<span class="title">Ṣẹda Awọn maapu WhatsApp pẹlu Kapta</span><hr>1 - Pin awọn ipo ni ẹgbẹ WhatsApp kan<br>2 - okeere iwiregbe si Kapta<br>3 - Pin maapu WhatsApp rẹ`,
				watchtutorial: "Aago Tutorial",
				tutorialUrl: "https://youtube.com/embed/vaPHy8S-OpA" + youtubeOpts,
				viewrecentmap: "Wo àwáàrí tó ṣẹṣẹ",
				showmap: "Fíhàn àwáàrí",
				selectFile: "Yí ìfọ̀rọ̀wérọ̀ WhatsApp padà sí àwòrán",
				observer: "Olùtọ́jú",
				date: "Ọjọ́",
				inputtopiclabel: "Kí ni o ti ṣe àwáàrí ní àpàdé WhatsApp yìí?",
				inputgoallabel: "Kí ni o fẹ́ ṣe tán pẹ̀lú àwáàrí yìí?",
				datasovmessage:
					"Ṣe o jẹ́ kí ẹgbẹ́ Kapta lò àwáàrí rẹ láti ṣèrànwọ́ ààárín rẹ?",
				about: "Nipa",
				aboutContent: `Kapta Mobile jẹ Progressive Web App lati ṣẹda Awọn Maapu WhatsApp ni awọn igbesẹ mẹta. <br>Kí nìdí?<br>Lati so awọn olumulo ati awọn olupilẹṣẹ alaye ilẹ-aye pọ. Wo bulọọgi tuntun wa ati ibi ti eyi ti bẹrẹ ni ọdun 2010:<br><li><a href='${whatsappMapsUrl}'>Awọn Maapu WhatsApp? Ṣiṣepọ awọn olumulo ati awọn olupilẹṣẹ alaye ilẹ-aye</a></li><br><li><a href='${extremeCitizenUrl}'>Ẹkọ Citizens Extreme ni igbó Congo</a></li><br><em>Kapta: Eto (a)lakanṣe afowopamọwọ lati so awọn olumulo ati awọn olupilẹṣẹ alaye ilẹ pọ.</em>`,
				people: "Àwọn Ènìyàn",
				peopleContent: `Kapta ni a ṣe nipasẹ ẹgbẹ iwadi Ẹkọ Citizens Extreme (ExCiteS) ti University College London (UCL) ati Ile-iṣẹ Idagbasoke Iṣiro (UCL ARC), pẹlu iranlọwọ lati ọdọ awọn alabaṣepọ ita ati awọn alabapin.<br>Lọwọlọwọ, ẹgbẹ Kapta akọkọ ni:<br><ul><li><a href='${marcosUrl}'>Marcos Moreu, UCL Geography</a></li><li><a href='${fabienUrl}'>Fabien Moustard, UCL Geography</a></li><li><a href='${tomUrl}'>Tom Couch, UCL ARC</a></li><li><a href='${mukiUrl}'>Muki Haklay, UCL Geography</a></li><li><a href='${jonathanUrl}'>Jonathan Cooper, UCL ARC</a></li><li><a href='${claireUrl}'>Claire Ellul, UCL CEGE</a></li><li><a href='${amandaUrl}'>Amanda Ho-Lyn, UCL ARC</a></li><li><a href='${jedUrl}'>Jed Stevenson, Ile-ẹkọ giga Durham</a></li><li><a href='${desUrl}'>Dessalegn Teckle, Ile-ẹkọ giga Addis Ababa, NGO IPC</a></li></ul>`,
				legalDisclaimer: "Disclaimer: The Kapta team has made every effort to develop an app that parse WhatsApp chats to create WhatsApp Maps with the highest possible accuracy. However, we cannot accept responsibility for any errors, omissions, or inconsistencies that may occur. Please always make your own judgement about the accuracy of the maps and validate the information using other sources. If you encounter any issues or have feedback, please reach out to us at geog.excites@ucl.ac.uk or via WhatsApp at +34 678380944.",
				confirm: "Ẹ̀rí",
				yes: "Bẹ́ẹ̀ni",
				no: "Rárá",
				sharedata: "Pín ìwòye àwáàrí",
				shareimg: "Pín àwòrán àwáàrí",
				uploaddata: "Gbé só Kapta lórí Ayélujára",
				addMetadataTitle: "Ṣàpèjúwe àwáàrí yìí",
				sharingTitle: "Pín àwáàrí yìí",
				addDescription: "Àkọlé àwáàrí rẹ",
				updateDescription: "Update map title",
				copyright: "Kapta látọwọ́ UCL",
				supportOption: "Gba ìtìlẹ́yìn láti mú àwáàrí rẹ dàra sí",
				installPrompt: "Fi Kapta sí ẹ̀rọ rẹ láti ṣẹ̀dá àwọn Màáp WhatsApp",
				installClickMessage:
					"Kapta ti wa ni afikun si iboju ile rẹ. Eyi le gba iṣẹju diẹ",
				desktoporiosPrompt:
					"Kapta ń ṣiṣẹ́ dáradára jù lórí àwọn ẹ̀rọ alátagbà Android. Jọ̀wọ́ ṣàbẹ̀wò sí ojú ewé yìí lórí ẹ̀rọ alátagbà láti lo iṣẹ́ àmúlò náà.",
				install: "Ìgbele",
				dismiss: "Ìsọfúnni",
			},
		},
	},
});

export { i18next, supportedLanguages };
