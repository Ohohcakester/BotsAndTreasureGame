sampleStages = {
    'tutorial': [
        'WWWWBLL',
        'WWBWBLT',
        'CHBWWLL',
        '',
        '{',
        '  "tinybot": [0,1],',
        '  "bigbot": [1,1],',
        '  "gates": [',
        '    [[3,0,3,1], [6,0]],',
        '    [[3,1,3,2], [6,2]]',
        '  ]',
        '}',
    ].join('\n'),

    'tutorial 2': [
        'HBLBT',
        'WBCBW',
        'WBLBW',
        'WWWWW',
        'LLLLL',
        '',
        '{',
        '  "tinybot": [1,4],',
        '  "bigbot": [3,4],',
        '  "gates": [',
        '    [[0,2,0,3], [2,0]],',
        '    [[4,1,4,2], [0,4]],',
        '    [[4,2,4,3], [4,4]]',
        '  ]',
        '}',
    ].join('\n'),

    'sample': [
        'BBBBBBBBLLTL',
        'BBBWWWWBLLLL',
        'BBBWWWWBLLLW',
        'CLBWWBWBBWWW',
        'CLWWWBWWWWWW',
        'LWWLLBWBWBBL',
        'WWWBBBLBWLLL',
        'HWWBBBLBWLLL',
        '',
        '{',
        '  "tinybot": [1,7],',
        '  "bigbot": [2,7],',
        '  "gates": [',
        '    [[3,3,3,4], [0,5]],',
        '    [[4,3,4,4], [8,1]],',
        '    [[6,2,6,3], [1,3]],',
        '    [[6,4,7,4], [4,5]],',
        '    [[6,5,6,6], [9,7]],',
        '    [[8,4,9,4], [11,1]],',
        '    [[8,5,8,6], [11,6]]',
        '  ]',
        '}',
    ].join('\n'),

    'vertexcover': [
        'CWLWLWLWLWL',
        'CWLWLWLWLWL',
        'CWLWLWLWLWL',
        'LWLWLWLWLWL',
        'LBBBBBBBBBB',
        'LWWWWWWWWWW',
        'TWWWWWWWWWH',
        '',
        '{',
        '  "tinybot": [0,3],',
        '  "bigbot": [0,4],',
        '  "gates": [',
        '    [[0,5,1,5], [2,0]],',
        '    [[0,6,1,6], [4,3]],',
        '',
        '    [[1,5,2,5], [2,1]],',
        '    [[1,6,2,6], [6,3]],',
        '',
        '    [[2,5,3,5], [8,3]],',
        '    [[2,6,3,6], [2,2]],',
        '',
        '    [[3,5,4,5], [10,3]],',
        '    [[3,6,4,6], [2,3]],',
        '',
        '    [[4,5,5,5], [4,2]],',
        '    [[4,6,5,6], [6,2]],',
        '',
        '    [[5,5,6,5], [6,1]],',
        '    [[5,6,6,6], [8,1]],',
        '',
        '    [[6,5,7,5], [8,2]],',
        '    [[6,6,7,6], [10,2]]',
        '  ]',
        '}',
    ].join('\n'),

    'repeatbuttons': [
        'LLBBTCC',
        'LWWBLLL',
        'WWWWWWW',
        'BBWBBBL',
        'BBWBBBL',
        'BBWBBBL',
        'WWWWWBB',
        'LWWBWBB',
        'LLBBHBB',
        '',
        '{',
        '  "tinybot": [0,2],',
        '  "bigbot": [1,2],',
        '  "gates": [',
        '    [[1,1,2,1], [6,3]],',
        '    [[1,2,2,2], [0,1]],',
        '',
        '    [[2,2,3,2], [0,7]],',
        '',
        '    [[1,6,2,6], [1,8]],',
        '    [[1,7,2,7], [6,5]],',
        '',
        '    [[2,6,3,6], [1,0]],',
        '',
        '    [[2,3,2,4], [4,1]],',
        '    [[2,4,2,5], [5,1]]',
        '  ]',
        '}',
    ].join('\n'),
}

function createSampleStageButtons() {
    for (var key in sampleStages) {
        if (!sampleStages.hasOwnProperty(key)) continue;
        var name = key;
        var onClickAttribute = 'loadSampleStage("' + name + '")';
        var btn = document.createElement('BUTTON');
        btn.setAttribute('onclick', onClickAttribute);
        btn.appendChild(document.createTextNode(name));
        document.getElementById('sampleStageButtons').appendChild(btn);
    }

    loadSampleStage('tutorial');
    initGameFromTextArea();
}

function loadSampleStage(stageName) {
    document.getElementById('stageTextArea').value = sampleStages[stageName];
}
