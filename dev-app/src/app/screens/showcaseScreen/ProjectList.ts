import edelgamesPreviewImage from "../../../resources/images/edelgames.png";
import prototimePreviewImage from "../../../resources/images/prototime.png";
import mcfunctionSyntaxPreviewImage from "../../../resources/images/mcfunction_highlighting.png";
import cronTranslatorPreviewImage from "../../../resources/images/cron_translator.png";

type tag = {
    title: string,
    value: string
}

type ProjectDefinition = {
    id: string,
    year: number,
    title: string,
    description: string,
    githubLink?: string,
    tags: tag[],
    image?: string
}

const ProjectList: ProjectDefinition[] = [
    {
        id: 'mcfunction-intellij-syntax',
        githubLink: 'https://github.com/Brofian/intellij-mcfunction-plugin',
        year: 2023,
        title: 'IntelliJ: McFunction Language Support',
        tags: [
            {title: 'language', value: 'Java'},
            {title: 'state', value: 'Work in progress'},
            {title: 'relation', value: 'IntelliJ'},
        ],
        image: mcfunctionSyntaxPreviewImage,
        description: 'I love Minecraft. And I love coding. So is there anything better than coding in Minecraft? Thanks to Datapacks and mcfunction files (aka the Mojang Version of a modding engine), this can become reality!' +
            ' But there is a downside. I usually code in the <a href="https://www.jetbrains.com/de-de/idea/">IntelliJ or PhpStorm IDE</a>, but these do not support syntax highlighting. So either do I switch to a normal Texteditor with mcfunction support (Atom), or I do it myself! TLDR: that\'s what I did'
    },
    {
        id: 'edelgames',
        githubLink: 'https://github.com/edelmaenner/edelgames',
        year: 2023,
        title: 'Edelgames mini games',
        tags: [
            {title: 'language', value: 'Typescript'},
            {title: 'version', value: '0.1.2'},
            {title: 'relation', value: 'ReactJs, socket-io, eslint'},
        ],
        image: edelgamesPreviewImage,
        description: 'During the covid period, some online friends from <a href="https://edelmaenner.net">https://edelmaenner.net</a> (a survival vanilla Minecraft Server) and me were talking in discord and playing online games together regularly. Sometimes even multiple times a week for several hours. As we tried more and more games ' +
            'on the internet, we were often disappointed by errors, bugs or just missing features. At this moment, the idea to edelgames was born. We discussed our goals with this project, which technologies to use and what to make out of them. I quickly build a small framework in ReactJS and ' +
            'added a chat game as an example. NodeJS Server with a ReactJs Frontend. Soon, the others got on board and added their part of the functionality. We decided to go on without a database, but to enable usernames and profile images, a login into the existing forum was build. Some minigames were added, multiple rooms could play different games at the ' +
            'same time, linting made the code uniform, an automated deployment onto a test server, many bugfixes, a lot of deleted and rewritten code, and and and. This probably was one of the bigger project, as it took hours upon hours, but I think that was totally worth it'
    },
    {
        id: 'advent_of_code',
        githubLink: 'https://github.com/Brofian/adventofcode_answers',
        year: 2022,
        title: 'Advent of Code answers',
        tags: [
            {title: 'language', value: 'PHP'},
        ],
        description: 'If you have never heard of Advent of Code, it\'s about time you head to <a href="https://adventofcode.com/">https://adventofcode.com/</a> and take a look at this beautiful project. Every day from the first of December ' +
            'to the 25th, a new part of a story and a matching riddle is released. And it is your (mine (our)) task to solve it, using code. Any language, any method. So I wrote some code for a better access ' +
            'to the individual riddles and started solving. Often times, I also used the code to explain some concepts to other trainees.'
    },
    {
        id: 'prototime',
        githubLink: 'https://github.com/Brofian/prototime',
        year: 2022,
        title: 'Prototime',
        tags: [
            {title: 'language', value: 'Javascript'},
            {title: 'relation', value: 'React Native'},
            {title: 'version', value: '0.7.1'}
        ],
        image: prototimePreviewImage,
        description: 'At the time, I worked for a certain amount of time each week and wanted to keep an eye on my workload. So I started the development of an android app ' +
            ', that would offer a time protocol and sum up all the information for me. This Project would expand and soon include a live timer to track without keeping an eye on the clock, adding comments and breaks to the protocol list, ' +
            'allow the editing and deletion of them, and much more. <br />' +
            'It was at this time, that I discovered my preference for React and Javascript, as I had previously worked with Android Studio. What a difference in simplicity, accessibility and usability! '
    },
    {
        id: 'cron_translator',
        githubLink: 'https://github.com/Brofian/cron-translator',
        year: 2022,
        title: 'Cron Translator',
        tags: [
            {title: 'language', value: 'PHP'},
            {title: 'relation', value: 'Cron Package'},
            {title: 'relation', value: 'Cronjob'},
            {title: 'version', value: '0.2.4'},
        ],
        image: cronTranslatorPreviewImage,
        description: 'While there are some good implementations for translators between a Cronjob expression and human-readable sentences (e.g. <a href="https://crontab.guru/">https://crontab.guru/</a>), I was not satisfied with the german translations. ' +
            'They almost never sounded natural or even understandable on the most part. So I build a very, very lightweight program to read a cron string, tokenize it and ' +
            'return a good sounding sentence. This includes german edge cases, the combination of minutes and hours or some special structures for common combinations'
    },
    {
        id: 'spawnwork',
        year: 2020,
        title: 'Spawn Framework',
        tags: [
            {title: 'language', value: 'PHP'},
            {title: 'relation', value: 'Framework'},
            {title: 'state', value: 'unreleased'},
        ],
        description: 'At the time, i was in the middle of my vocational training. I worked a lot with Shopware and the underlying Framework Symfony. To get a better understanding of how '  +
            'and why certain things were done in these frameworks, i decided to create one myself. This started out as a basic MVC Script, but i improved it alongside my own learning. ' +
            'An important step was to understand the level of abstraction, that is used (and required) in frameworks of this size. So i tried implementing it the same way. First i made a service modal ' +
            'to automatically create class instances with their required parameters, added twig and scss, implement a plugin and version system and creating my very own database abstraction layer (just to name a few things). In hindsight, there were many things that i could probably' +
            'have done better. But it was a great learning experience and i had a lot of  "oh, so that\'s why" - moments'
    }
];
export default ProjectList;
