/* eslint-disable no-useless-escape */
const mErrors = {
    caracteres: { line: 0, column: 0, description: 'Los caracteres validos son: a-z, A-Z, 0-9, (, ), {, }, [, ], ., ,, ;, :, +, -, *, /, =, >, <, !, &, |, ?, `, ", %, $' },
    go: { line: '?', column: '?', description: 'Se espera el inicio del programa con la palabra reservada Go' },
    finish: { line: '?', column: '?', description: 'Se espera el final del programa con la palabra reservada Finish' },
    vare: { line: '?', column: '?', description: 'Se espera la declaracion de variables con la palabra reservada Vare' },
    gobody: { line: '?', column: '?', description: 'Se espera el inicio del cuerpo del programa con la palabra reservada Gobody' },

}
export const analize = (text) => {

    const simpleComments = new RegExp(/\/{2}.*/gm);
    const multiLineComments = new RegExp(/\/\*[\s\S]*\*\//gm);
    const lineBreak = new RegExp(/\n/gm);

    const multipleSpaces = new RegExp(/\s{2,}/gm);

    const supportedCharacters = new RegExp(/\w|\s|\(|\)|\{|\}|\[|\]|\.|\,|\;|\:|\+|\-|\*|\/|\=|\>|\<|\!|\&|\||\?|\||\'|\`|\"|\%|\$/gm);

    const errors = [];
    const warnings = [];

    //
    const textProcessed = text.replace(multiLineComments, '') // remove multiline comments
        .replace(simpleComments, '') // remove simple comments
        .replace(multipleSpaces, ' ') // remove multiple spaces
        .replace(/;\s{1}/gm, ';') // remove space before semicolon
        .replace(/^\s+/gm, '') // remove spaces at the beginning of the line


    console.log(textProcessed);

    const lexico = textProcessed.replace(supportedCharacters, '');
    lexico.split('').forEach((char, index) => {
        const line = text.slice(0, text.indexOf(char, index)).split(lineBreak)?.length;
        const column = text.slice(0, text.indexOf(char, index)).split(lineBreak)?.pop()?.length;
        errors.push({ ...mErrors.caracteres, line, column });
    });

    // buscar palabras reservadas

    const go = text.search(/[^\w]*(Go)\s+/gm); // reemplazar
    const finish = text.replace('Finish', 'Finish ').search(/[^\w]*(Finish)\s+/gm); // reemplazar
    const vare = text.search(/[^\w]*(Vare)\s+/gm); // reemplazar
    const gobody = text.search(/[^\w]*(Gobody)\s+/gm); // reemplazar

    console.log(go, finish, vare, gobody);

    if (go === -1) errors.push({ ...mErrors.go }); // inicio del programa
    else {
        const line = text.slice(0, go).split(lineBreak)?.length;
        const column = text.slice(0, go).split(lineBreak)?.pop()?.length;
        const start = textProcessed.search(/[^\w]*(Go)\s+/gm);
        if (start !== 0 && start !== -1) errors.push({ ...mErrors, description: 'El inicio del programa debe estar al inicio del archivo', line, column })
        if (go > finish && finish !== -1) errors.push({ ...mErrors.finish, description: 'El inicio del programa no puede estar despues del final "Finish"', line, column });
        if (go > vare && vare !== -1) errors.push({ ...mErrors.vare, description: 'El inicio del programa no puede estar despues de la declaracion de variables "Vare"', line, column });
        if (go > gobody && gobody !== -1) errors.push({ ...mErrors.gobody, description: 'El inicio del programa no puede estar despues del inicio del cuerpo "Gobody"', line, column });
    }
    if (finish === -1) errors.push({ ...mErrors.finish }); // final del programa
    else {
        const line = text.slice(0, finish).split(lineBreak)?.length;
        const column = text.slice(0, finish).split(lineBreak)?.pop()?.length;
        if (finish < go && go !== -1) errors.push({ ...mErrors.go, description: 'El final del programa no puede estar antes del inicio "Go"', line, column });
        if (finish < vare && vare !== -1) errors.push({ ...mErrors.vare, description: 'El final del programa no puede estar antes de la declaracion de variables "Vare"', line, column });
        if (finish < gobody && gobody !== -1) errors.push({ ...mErrors.gobody, description: 'El final del programa no puede estar antes del inicio del cuerpo "Gobody"', line, column });
    }
    if (vare === -1) errors.push({ ...mErrors.vare }); // declaracion de variables
    else {
        const line = text.slice(0, vare).split(lineBreak)?.length;
        const column = text.slice(0, vare).split(lineBreak)?.pop()?.length;
        if (vare < go && go !== -1) errors.push({ ...mErrors.go, description: 'La declaracion de variables no puede estar antes del inicio "Go"', line, column });
        if (vare > finish && finish !== -1) errors.push({ ...mErrors.finish, description: 'La declaracion de variables no puede estar despues del final "Finish"', line, column });
        if (vare > gobody && gobody !== -1) errors.push({ ...mErrors.gobody, description: 'La declaracion de variables no puede estar despues del inicio del cuerpo "Gobody"', line, column });
    }
    if (gobody === -1) errors.push({ ...mErrors.gobody }); // inicio del cuerpo
    else {
        const line = text.slice(0, gobody).split(lineBreak)?.length;
        const column = text.slice(0, gobody).split(lineBreak)?.pop()?.length;
        if (gobody < go && go !== -1) errors.push({ ...mErrors.go, description: 'El inicio del cuerpo no puede estar antes del inicio "Go"', line, column });
        if (gobody > finish && finish !== -1) errors.push({ ...mErrors.finish, description: 'El inicio del cuerpo no puede estar despues del final "Finish"', line, column });
        if (gobody < vare && vare !== -1) errors.push({ ...mErrors.vare, description: 'El inicio del cuerpo no puede estar antes de la declaracion de variables "Vare"', line, column });
    }

    return {
        errors: errors,
        warnings: warnings,
        codeProcessed: textProcessed,
    }
}