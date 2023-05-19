import edelgamesPreviewImage from "../../../resources/images/edelgames.png";
import prototimePreviewImage from "../../../resources/images/prototime.png";
import mcfunctionSyntaxPreviewImage from "../../../resources/images/mcfunction_highlighting.png";
import cronTranslatorPreviewImage from "../../../resources/images/cron_translator.png";

type ProjectDefinition = {
    id: string,
    year: number,
    version?: string,
    title: string,
    description: string,
    githubLink?: string,
    tags: string[],
    image?: string
}

const ProjectList: ProjectDefinition[] = [
    {
        id: 'mcfunction-intellij-syntax',
        githubLink: 'https://github.com/Brofian/intellij-mcfunction-plugin',
        year: 2023,
        title: 'IntelliJ: McFunction Language Support',
        tags: ['Java', 'IntelliJ', 'Work in progress'],
        version: undefined,
        image: mcfunctionSyntaxPreviewImage,
        description: 'I love Minecraft. And i love coding. So is there anything better than coding in Minecraft? Thanks to Datapacks and mcfunction files (aka the Mojang Version of a modding engine), this can become reality!' +
            ' But there is a downside. I usually code in the IntelliJ Editor or PhpStorm, but these do not support syntax highlighting. So either do i switch to a normal Texteditor with mcfunction support (Atom), or i do it myself! TLDR: thats what i did'
    },
    {
        id: 'edelgames',
        githubLink: 'https://github.com/edelmaenner/edelgames',
        year: 2023,
        title: 'Edelgames Minispiele',
        tags: ['TypeScript', 'ReactJs', 'socket-io', 'eslint', 'Group Project'],
        version: '0.1.2',
        image: edelgamesPreviewImage,
        description: 'During the covid period, some online friends from edelmaenner.net (a survival vanilla Minecraft Server) and me were talking in discord and playing online games together regularly. Sometimes even multiple times a week for several hours. As we tried more and more games ' +
            'on the internet, we were often disappointed by errors, bugs or just missing features. At this moment, the idea to edelgames was born. We discussed about our goals with this project, which technologies to use and what to make out of them. I quickly build a small framework in ReactJS and ' +
            'added a chat game as an example. NodeJS Server with a ReactJs Frontend. Soon, the others got on board and added their part of the functionality. We decided to go on without a database, but to enable usernames and profile images, a login into the existing forum was build. Some minigames were added, multiple rooms could play different games at the ' +
            'same time, linting made the code uniform, an automated deployment onto a test server, many bugfixes, a lot of deleted and rewritten code, and and and. This probably was one of the bigger project, as it took hours upon hours, but i think that was totally worth it'
    },
    {
        id: 'advent_of_code',
        githubLink: 'https://github.com/Brofian/adventofcode_answers',
        year: 2022,
        title: 'Advent of Code answers',
        tags: ['PHP', 'Framework'],
        description: 'If you have never heard of Advent of Code, its about time you head to https://adventofcode.com/ and take a look at this beautiful project. Every day from the first of November ' +
            'to the 25th, a new part of a story and a matching riddle is released. And it is your (mine (our)) task to solve it, using code. Any language, any method. So i wrote some code for an better access ' +
            'to the individual riddles and started solving. Often times, i also used the code to explain some concepts to other trainees.'
    },
    {
        id: 'prototime',
        githubLink: 'https://github.com/Brofian/prototime',
        year: 2022,
        title: 'Prototime',
        tags: ['React Native', 'Javascript', 'Released'],
        version: '0.7.1',
        image: prototimePreviewImage,
        description: 'At the time, i worked for a certain amount of time each week and wanted to keep an eye on my workload. So i started the development of an android app ' +
            ', that would offer a time protocol and sum up all the information for me. This Project would expand and soon include a live timer to track without keeping an eye on the clock, adding comments comments and breaks to the protocol list, ' +
            'allow the editing and deletion of them, and much more. \n' +
            'It was at this time, that i discovered my preference for React and Javascript, as i had previously worked with Android Studio. What a difference in simplicity, accessibility and usability! '
    },
    {
        id: 'cron_translator',
        githubLink: 'https://github.com/Brofian/cron-translator',
        year: 2022,
        title: 'Cron Translator',
        tags: ['PHP', 'Cron', 'Composer Package'],
        version: '0.2.4',
        image: cronTranslatorPreviewImage,
        description: 'While there are some good implementations for translators between a Cronjob expression and human readable sentences (e.g. https://crontab.guru/), i was not satisfied with the german translations. ' +
            'They almost never sounded natural or even understandable on the most part. So i build a very very lightweight program to read a cron string, tokenize it and ' +
            'return a good sounding sentence. This includes german edge cases, the combination of minutes and hours or some special structures for common combinations'
    }
];
export default ProjectList;