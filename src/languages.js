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
				instructions: `<span class="title">How to use Kapta </span><hr> 1 - Create a WhatsApp group<br> 2 - Ask the group to share & describe locations<br> 3 - Click 'Export chat' to the Kapta mobile app<br> 4 - Share your WhatsApp Map with Kapta`,
				watchtutorial: "Watch tutorial",
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
				installPrompt:
					"Kapta works best when installed on a mobile device. Install now?",
				install: "Install",
				dismiss: "Dismiss",
			},
		},
		es: {
			translation: {
				key: "hola mundo",
				asktheteam: "Pregúntanos lo que quieras",
				instructions: `<span class="title">Como usar Kapta</span><hr>1 - Crea un grupo de WhatsApp<br> 2 - Pídele al grupo que comparta y describa ubicaciones<br> 3 - Haz clic en 'Exportar chat' a la app Kapta<br> 4 - Comparte tu mapa de WhatsApp con Kapta`,
				watchtutorial: "Ver tutorial",
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
				addDescription: "Agrega un título a tu mapa",
				updateDescription: "Actualizar el título del mapa",
				copyright: "Kapta by UCL",
				supportOption: "Obtenga apoyo para mejorar su mapa",

				installPrompt:
					"Kapta funciona mejor cuando se instala en un dispositivo móvil. ¿Instalar ahora?",
				install: "Instalar",
				dismiss: "No Instalar",
			},
		},
		fr: {
			translation: {
				key: "bonjour le monde",
				asktheteam: "Demandez-nous ce que vous voulez",
				instructions: `<span class="title">Comment utiliser Kapta</span><hr>1 - Créez un groupe WhatsApp<br> 2 - Demandez au groupe de partager et de décrire des emplacements<br> 3 - Cliquez sur 'Exporter le chat' vers l'application mobile Kapta<br> 4 - Utilisez et partagez votre carte WhatsApp avec Kapta`,
				watchtutorial: "Regarder le tutoriel",
				viewrecentmap: "Voir la carte récente",
				showmap: "Afficher la carte",
				observer: "Observateur",
				date: "Date",
				inputtopiclabel: "Qu`avez-vous cartographié dans ce groupe WhatsApp?",
				inputgoallabel: "Que souhaitez-vous accomplir avec cette carte?",
				datasovmessage:
					"Autorisez-vous l`équipe de Kapta à utiliser votre carte pour soutenir votre communauté?",
				confirm: "Confirmer",
				yes: "Oui",
				no: "Non",
				sharedata: "Partagez les données",
				shareimg: "Partager une photo",
				uploaddata: "Télécharger sur Kapta Web",
				addMetadataTitle: "Décrivez cette carte",
				sharingTitle: "Partager cette carte",
				addDescription: "Ajoutez un titre à votre carte",
				updateDescription: "Mettre à jour le titre de la carte",
				copyright: "Kapta by UCL",
				supportOption: "Obtenez un support pour améliorer votre carte",
				installPrompt:
					"Kapta fonctionne mieux lorsqu'il est installé sur un appareil mobile. Installer maintenant?",
				install: "Installer",
				dismiss: "rejeter",
			},
		},
		am: {
			translation: {
				key: "ሠላም ዓለም",
				asktheteam: "ምንም ጥያቄ ጠይቁን",
				instructions: `<span class="title">ካፕታ እንዴት እንደሚጠቀሙ</span><hr>1 - የ WhatsApp ቡድን ይፍጠሩ<br>2 - ቡድኑን እንዲያካፍል እና አካባቢዎችን እንዲገልጽ ጠይቅ<br>3 - ወደ ካፕታ ሞባይል መተግበሪያ 'ቻት ላክ' የሚለውን ጠቅ ያድርጉ<br>4 - የ WhatsApp ካርታዎን በካፕታይጠቀሙ እና ያካፍሉ።`,
				watchtutorial: "አጋዥ ስልጠናን ይመልከቱ",
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
				sharedata: "ከዚህ ካርታ ውሂብ አጋራ",
				shareimg: "ምስል አጋራ",
				uploaddata: "ወደ ካፕታ ድር ይስቀሉ።",
				addMetadataTitle: "ይህን ካርታ ይግለጹ",
				sharingTitle: "ይህን ካርታ አጋራ",
				addDescription: "በካርታዎ ላይ ርዕስ ያክሉ",
				updateDescription: "የካርታ ርዕስ ያዘምኑ",
				copyright: "Kapta by UCL",
				supportOption: "ካርታዎን ለማሻሻል ድጋፍ ያግኙ",
				installPrompt: "ካፕታ በሞባይል መሳሪያ ላይ ሲጫኑ በተሻለ ሁኔታ ይሰራል. አሁን ይጫኑ?",
				install: "ጫን",
				dismiss: "ማሰናበት",
			},
		},
		pt: {
			translation: {
				key: "olá mundo",
				asktheteam: "Pergunte-nos qualquer coisa",
				instructions: `<span class="title">Como usar o Kapta</span><hr>1 - Crie um grupo de WhatsApp<br>2 - Compartilhe e descreva locais<br> 3 - Exporte o chat para o Kapta<br> 4 - Compartilhe ou venda seu mapa`,
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
				copyright: "Kapta by UCL",
				supportOption: "Obtenha suporte para melhorar seu mapa",
				installPrompt:
					"Kapta funciona melhor quando instalado em um dispositivo móvel. Instalar agora?",
				install: "Instalar",
				dismiss: "Dispensar",
			},
		},
		yo: {
			translation: {
				key: "báwo ni ayé",
				asktheteam: "Béèrè ohunkóhun lọ́wọ́ wa",
				instructions: `<span class="title">Báwo ni láti lò Kapta</span><hr>1 - Dá ìgbìmọ̀ àwáàrí ní WhatsApp<br>2 - Pín & ṣàpèjúwe àwọn àyè<br>3 - Gbé àjùmọ̀ṣepọ̀ sórí Kapta<br>4 - Pín tàbí tà átààwá àwáàrí rẹ`,
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
				copyright: "Kapta by UCL",
				supportOption: "Gba ìtìlẹ́yìn láti mú àwáàrí rẹ dàra sí",
				installPrompt:
					"Kapta dára jùlọ tí ó bá wà nínú ètò alágbèéká. Ṣe yóò ìgbele?",
				install: "Ìgbele",
				dismiss: "Ìsọfúnni",
			},
		},
	},
});

export { i18next, supportedLanguages };
