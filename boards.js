function getBoardPool(){
    return [

        [
            [null,null,null,null,null],
            [null,{type:"rook",moves:0},null,null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,null,{type:"bishop",moves:0},null,null],
            [null,null,null,{type:"knight",moves:0},null]
        ],

        [
            [null,null,null,null,null],
            [null,null,{type:"queen",moves:0},null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,{type:"rook",moves:0},null,null,null],
            [null,null,null,{type:"bishop",moves:0},null]
        ],

        [
            [null,null,{type:"knight",moves:0},null,null],
            [{type:"bishop",moves:0},null,null,null,{type:"rook",moves:0}],
            [null,{type:"pawn",moves:0},{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [null,null,null,null,null]
        ],

        [
            [null,null,null,null,{type:"queen",moves:0}],
            [null,null,null,null,null],
            [null,null,{type:"king",moves:0},null,{type:"pawn",moves:0}],
            [null,null,null,null,null],
            [null,null,{type:"bishop",moves:0},null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"king",moves:0},null,{type:"bishop",moves:0}],
            [null,null,null,null,null],
            [null,null,{type:"knight",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [null,null,{type:"knight",moves:0},null,null],
            [null,null,{type:"king",moves:0},null,null],
            [{type:"rook",moves:0},null,null,null,null],
            [null,null,null,{type:"bishop",moves:0},null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,{type:"queen",moves:0},{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"bishop",moves:0},null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,{type:"bishop",moves:0},null,{type:"rook",moves:0},null],
            [null,null,{type:"queen",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [null,{type:"rook",moves:0},null,null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"bishop",moves:0},null,{type:"knight",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,{type:"knight",moves:0}],
            [null,null,{type:"king",moves:0},null,null],
            [{type:"rook",moves:0},null,null,{type:"knight",moves:0},null],
            [null,null,{type:"pawn",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [{type:"queen",moves:0},null,null,null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"bishop",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [null,{type:"knight",moves:0},{type:"bishop",moves:0},null,null],
            [null,null,{type:"king",moves:0},null,null],
            [{type:"pawn",moves:0},null,null,{type:"rook",moves:0},null],
            [{type:"queen",moves:0},null,{type:"rook",moves:0},null,{type:"pawn",moves:0}]
        ],

        [
            [null,null,null,null,null],
            [null,{type:"rook",moves:0},null,null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"queen",moves:0},null,null,{type:"bishop",moves:0},null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [{type:"bishop",moves:0},null,{type:"king",moves:0},null,{type:"rook",moves:0}],
            [null,null,null,null,null],
            [null,{type:"queen",moves:0},null,null,null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,{type:"queen",moves:0},{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"bishop",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,null,null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"queen",moves:0},null,{type:"bishop",moves:0},null,null]
        ],

        [
            [{type:"pawn",moves:0},null,null,null,null],
            [null,{type:"bishop",moves:0},null,null,null],
            [null,{type:"knight",moves:0},{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"queen",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [null,{type:"queen",moves:0},null,null,null],
            [null,null,{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"bishop",moves:0},null,null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"king",moves:0},null,{type:"bishop",moves:0}],
            [null,null,null,null,null],
            [{type:"queen",moves:0},null,null,null,null]
        ],

        [
            [null,null,null,null,null],
            [null,null,null,null,null],
            [null,{type:"bishop",moves:0},{type:"king",moves:0},null,null],
            [null,null,null,null,null],
            [{type:"rook",moves:0},null,{type:"queen",moves:0},null,null]
        ]

    ];
}