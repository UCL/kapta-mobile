import i18next from "i18next";

const supportedLanguages = {
	en: "🇬🇧 English",
	es: "🇪🇸 Español",
	fr: "🇫🇷 Français",
	pt: "🇵🇹 Português",
	am: "🇪🇹 አማርኛ",
	yo: "🇳🇬 Yorùbá",
};
const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
i18next.init({
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
				tutorialUrl:
					"https://youtube.com/embed/vaPHy8S-OpA?si=w6ou_ekAzkZbHJ3i",
				viewrecentmap: "View recent map",
				showmap: "Show map",
				observer: "Observer",
				date: "Date",
				inputtopiclabel: "What have you mapped in this WhatsApp group?",
				inputgoallabel: "What do you want to achieve with this map?",
				datasovmessage:
					"Do you allow the Kapta team to use your map to support your community?",
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
				installClickMessage: "Kapta is now being added to your home screen. This might take a few seconds",
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
				tutorialUrl:
					"https://youtube.com/embed/hq2h8Ou2BOE?si=tVKt_J3L_0svUekr",
				viewrecentmap: "Ver mapa reciente",
				showmap: "Mostrar mapa",
				observer: "Observador",
				date: "Fecha",
				datasovmessage:
					"¿Permites que el equipo de Kapta use tu mapa para apoyar a tu comunidad?",
				inputtopiclabel: "¿Qué has mapeado en este grupo de WhatsApp?",
				inputgoallabel: "¿Qué deseas lograr con este mapa?",
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
				copyright: "Kapta by UCL",
				supportOption: "Ayuda para mejorar el mapa?",
				installPrompt: "Instalar Kapta para crear WhatsApp Maps",
				installClickMessage: "Kapta se está añadiendo a tu pantalla de inicio. Esto puede tardar unos segundos.",
				desktoporiosPrompt:
					"Kapta works best on Android mobile devices. Please visit this page on a mobile device to use the app.",
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
				tutorialUrl:
					"https://youtube.com/embed/3KrsKgFHYMs?si=liiXRfVzN4N4YMXk",
				viewrecentmap: "Voir la carte récente",
				showmap: "Afficher la carte",
				observer: "Observateur",
				date: "Date",
				inputtopiclabel: "Qu’avez-vous cartographié dans ce groupe WhatsApp?",
				inputgoallabel: "Que souhaitez-vous faire avec cette carte?",
				datasovmessage:
					"Autorisez-vous l’équipe Kapta à utiliser votre carte pour soutenir votre communauté?",
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
				copyright: "Kapta by UCL",
				supportOption: "Aide pour améliorer votre carte",
				installPrompt: "Installez Kapta pour créer WhatsApp Maps",
				installClickMessage: "Kapta est maintenant ajouté à votre écran d'accueil. Cela peut prendre quelques secondes",
				desktoporiosPrompt:
					"Kapta works best on Android mobile devices. Please visit this page on a mobile device to use the app.",
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
				tutorialUrl:
					"https://www.youtube.com/embed/vaPHy8S-OpA?si=Mnip_lPMTMiAYlUi",
				viewrecentmap: "የቅርብ ጊዜ ካርታ ይመልከቱ",
				showmap: "ካርታ አሳይ",
				observer: "ተመልካች",
				date: "ቀን",
				inputtopiclabel: "በዚህ ዋትስአፕ ቡድን ምን አሳፍረክ?",
				inputgoallabel: "በዚህ ካርታ ምን ማንኛት ነገር ልታከናውን ትፈልጋለህ?",
				datasovmessage: "በኮምዩኒቲዎ ማገዶ እንዲረዳዎ ካፕታ ቡድን ካርታዎን ማጠቃለያን ትፈቅድለታለህ?",
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
				copyright: "Kapta by UCL",
				supportOption: "ካርታዎን ለማሻሻል ድጋፍ አማራጭ",
				installPrompt: "ካፕታ በሞባይል መሳሪያ ላይ ሲጫኑ በተሻለ ሁኔታ ይሰራል. አሁን ይጫኑ?",
				installClickMessage: "ካፕታ አሁን ወደ መነሻ ስክሪንዎ እየታከለ ነው። ይሄ ጥቂት ሰከንዶች ሊወስድ ይችላል።",
				desktoporiosPrompt:
					"Kapta works best on Android mobile devices. Please visit this page on a mobile device to use the app.",
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
				tutorialUrl:
					"https://www.youtube.com/embed/vaPHy8S-OpA?si=Mnip_lPMTMiAYlUi",
				viewrecentmap: "Ver mapa recente",
				showmap: "Mostrar mapa",
				observer: "Observador",
				date: "Data",
				inputtopiclabel: "O que você mapeou neste grupo de WhatsApp?",
				inputgoallabel: "O que você quer alcançar com este mapa?",
				datasovmessage:
					"Você permite que a equipe Kapta use seu mapa para apoiar sua comunidade?",
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
				copyright: "Kapta by UCL",
				supportOption: "Obtenha suporte para melhorar seu mapa",
				installPrompt: "Instale o Kapta para criar WhatsApp Maps",
				installClickMessage: "Kapta está agora a ser adicionado à sua tela inicial. Isto pode levar alguns segundos",
				desktoporiosPrompt:
					"Kapta works best on Android mobile devices. Please visit this page on a mobile device to use the app.",
				install: "Instalar",
				dismiss: "Dispensar",
			},
		},
		yo: {
			translation: {
				key: "báwo ni ayé",
				asktheteam: "Béèrè ohunkóhun lọ́wọ́ wa",
				instructions: `<span class="title">Báwo ni láti lò Kapta</span><hr>1 - Pin awọn ipo ni ẹgbẹ WhatsApp kan<br>2 - Gbé àjùmọ̀ṣepọ̀ sórí Kapta<br>3 - Pín tàbí tà átààwá àwáàrí rẹ`,
				watchtutorial: "Aago Tutorial",
				tutorialUrl:
					"https://www.youtube.com/embed/vaPHy8S-OpA?si=Mnip_lPMTMiAYlUi",
				viewrecentmap: "Wo àwáàrí tó ṣẹṣẹ",
				showmap: "Fíhàn àwáàrí",
				observer: "Olùtọ́jú",
				date: "Ọjọ́",
				inputtopiclabel: "Kí ni o ti ṣe àwáàrí ní àpàdé WhatsApp yìí?",
				inputgoallabel: "Kí ni o fẹ́ ṣe tán pẹ̀lú àwáàrí yìí?",
				datasovmessage:
					"Ṣe o jẹ́ kí ẹgbẹ́ Kapta lò àwáàrí rẹ láti ṣèrànwọ́ ààárín rẹ?",
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
				copyright: "Kapta by UCL",
				supportOption: "Gba ìtìlẹ́yìn láti mú àwáàrí rẹ dàra sí",
				installPrompt: "Install Kapta to create WhatsApp Maps",
				installClickMessage: "Kapta ti wa ni afikun si iboju ile rẹ. Eyi le gba iṣẹju diẹ",
				desktoporiosPrompt:
					"Kapta works best on Android mobile devices. Please visit this page on a mobile device to use the app.",
				install: "Ìgbele",
				dismiss: "Ìsọfúnni",
			},
		},
	},
});

export { i18next, supportedLanguages };
