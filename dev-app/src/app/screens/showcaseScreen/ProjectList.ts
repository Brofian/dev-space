type ProjectDefinition = {
    id: string,
    year?: number,
    version?: string,
    title: string,
    description: string,
    githubLink?: string,
    tags: string[],
    image?: string
}

const ProjectList: ProjectDefinition[] = [
    {
        id: 'prototime',
        githubLink: 'https://github.com/Brofian/prototime',
        year: 2022,
        title: 'Prototime',
        tags: ['React Native', 'Javascript', 'Released'],
        version: '0.7.1',
        image: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600w-1037719192.jpg',
        description: 'At the time, i worked for a certain amount of time each week and wanted to keep an eye on my workload. So i started the development of an android app ' +
            ', that would offer a time protocol and sum up all the information for me. This Project would expand and soon include a live timer, comments, configurable times and breaks, and much more!'
    },
    {
        id: 'mcfunction-intellij-syntax',
        githubLink: 'https://github.com/Brofian/intellij-mcfunction-plugin',
        year: 2023,
        title: 'IntelliJ: McFunction Language Support',
        tags: ['Java', 'IntelliJ', 'Work in progress'],
        version: undefined,
        image: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600w-1037719192.jpg',
        description: 'I love Minecraft. And i love coding. So is there anything better than coding in Minecraft? Thanks to Datapacks and mcfunction files (aka the Mojang Version of a modding engine), this can become reality!' +
            ' But there is a downside. I usually code in the IntelliJ Editor or PhpStorm, but these do not support syntax highlighting. So either do i switch to a normal Texteditor with mcfunction support (Atom), or i do it myself! TLDR: thats what i did'
    }
];
export default ProjectList;