/*

version <0.1

The code for this is based on the code in the tutorial video:
ASCII Art with Vanilla JavaScript by Franks Laboratory.

https://www.youtube.com/watch?v=HeT-5RZgEQY

The original version is a static effect.
I added the rudimentary animation and my own text strings instead of symbols.

This isn't great code, but I really like experimenting with graphics code.

ToDo:

Document the algorithm.

Optimise the code
*/
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image();
image1.src = 'headcity320.jpg';

const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');

inputSlider.addEventListener('change', handleSlider);

class Cell {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    #text;
    #start;
    constructor(ctx, img, text, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#text = text;
        this.#ctx.drawImage(img, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
        this.#start = performance.now();
    }
    #randint(low,high) {
        return parseInt(low + Math.random() * (high - low));
    }
    #convertToSymbol(g) {
        if (g > 250) return '@';
        else if (g > 240) return '*';
        else if (g > 220) return '+';
        else if (g > 200) return '#';
        else if (g > 180) return '&';
        else if (g > 160) return '%';
        else if (g > 140) return '=';
        else if (g > 120) return '~';
        else if (g > 100) return 'f';
        else if (g > 80) return 'r';
        else if (g > 60) return '^';
        else if (g > 40) return 'w';
        else if (g > 20) return '.';
        else return '';

    }
    #scanImage(cellSize) {
        this.#imageCellArray = [];
        let overlay_array = [];
        let text_pos = 0;
        let reveal_text = '0123456789ABCDEF';
        let blank = true;
        let i = 0;
        let t = (performance.now() - this.#start) / 1000;
        let bl = 0;

        const hh = this.#pixels.height / cellSize;
        const ww = this.#pixels.width / cellSize;
        
        for (let y = cellSize; y < this.#pixels.height; y += cellSize) {
            for (let x = 0; x < this.#pixels.width-cellSize; x += cellSize) {
                const xx = (x / cellSize) / (ww - 2);
                const yy = (y / cellSize) / (hh - 2);
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.#pixels.width) + posX;



                if ( this.#pixels.data[pos + 3] > 128 ) {
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];
                    const total = red + green + blue;
                    const averageColorValue = total / 3;
                    let color = "rgb(" + red + "," + green + "," + blue + ")";  
                    //const symbol = this.#convertToSymbol(averageColorValue);
                    let symbol = this.#text[ ( text_pos % ( this.#text.length ) ) ];
                    //const symbol = reveal_text[this.#randint(0,reveal_text.length)];
                    
                    if (Math.hypot(xx - 0.7 - 0.05 * Math.sin((0.5*t)+6*yy), Math.pow( (yy*0.05)+0.98-(0.07*t % 2.5), 3 ) - 0.12  ) < 0.12) {
                        blank = true;
                        color = "rgb(" + 255 + "," + green + "," + 50 + ")";
                    }
                    else if (Math.hypot(xx - 0.3 - 0.05 * Math.sin((1.2*t)+8*yy), Math.pow( (yy*0.1)+1.7-(0.13*t % 2.5), 3 ) - 0.1  ) < 0.1) {
                        blank = true;
                        color = "rgb(" + parseInt(red*0.8) + "," + parseInt(green*0.8) + "," + parseInt(blue*0.8) + ")";
                        symbol = reveal_text[this.#randint(0,reveal_text.length)];
                    }
                    else if ( Math.hypot(xx - 0.8 + 0.05 * Math.sin((1.2*t)+5*yy), Math.pow( (yy*0.2)+1.0-(0.16*t % 2.5), 3 ) - 0.07  ) < 0.07) {
                        blank = true;
                        color = "rgb(" + 35 + "," + green + "," + 255 + ")";  
                    }
                    else if (Math.hypot(xx - 0.5 - 0.05 * Math.sin((1.6*t)+7*yy), Math.pow( (yy*0.2)+0.5-(0.10*t % 2.5), 3 ) - 0.1  ) < 0.1) {
                         blank = true;
                         color = "rgb(" + red + "," + 255 + "," + blue + ")";  
                    }
                    else if (Math.hypot(xx - 0.3 + 0.05 * Math.sin((0.7*t)+3*yy), Math.pow( (yy*0.3)+1.6-(0.21*t % 2.5), 3 ) - 0.05  ) < 0.05) {
                        blank = true;
                        color = "rgb(" + 225 + "," + 225 + "," + 100 + ")";   
                    }
                    else {
                        blank = true;
                        color = "rgb(" + red + "," + green + "," + blue + ")";  
                    }
                    //if (total > 200)
                    if (blank) {
                        this.#imageCellArray.push( new Cell(x, y, symbol, color) );
                        
                    }
                    text_pos++;
                    i++;
                }
            }
        }
        //console.log(this.#imageCellArray);
    }
    #drawAscii(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for ( let i = 0; i < this.#imageCellArray.length; i++) {
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }
    draw(cellSize){
        ctx.font = cellSize + 'px monospace';
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}

function handleSlider() {
    if (inputSlider.value == 1) {
        inputLabel.innerHTML = 'original image';
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    } else {
        inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + 'px';
        //handleID = setInterval( function() { 
        Interval = setInterval( function() {
            effect.draw(parseInt(inputSlider.value))
        }, 200 );
           // }, 500);
    }
}

let effect;
let text = `InWhichWeAreIntroducedToWinnie-The-PoohAndSomeBees,AndTheStoriesBeginHereIsEdwardBear,ComingDownstairsNow,Bump,Bump,Bump,OnTheBackOfHisHead,BehindChristopherRobin.ItIs,AsFarAsHeKnows,TheOnlyWayOfComingDownstairs,ButSometimesHeFeelsThatThereReallyIsAnotherWay,IfOnlyHeCouldStopBumpingForAMomentAndThinkOfIt.AndThenHeFeelsThatPerhapsThereIsn't.Anyhow,HereHeIsAtTheBottom,AndReadyToBeIntroducedToYou.Winnie-The-Pooh.WhenIFirstHeardHisName,ISaid,JustAsYouAreGoingToSay,"ButIThoughtHeWasABoy?""SoDidI,"SaidChristopherRobin."ThenYouCan'tCallHimWinnie?""IDon't.""ButYouSaid——""He'sWinnie-Ther-Pooh.Don'tYouKnowWhat'Ther'Means?""Ah,Yes,NowIDo,"ISaidQuickly;AndIHopeYouDoToo,BecauseItIsAllTheExplanationYouAreGoingToGet.SometimesWinnie-The-PoohLikesAGameOfSomeSortWhenHeComesDownstairs,AndSometimesHeLikesToSitQuietlyInFrontOfTheFireAndListenToAStory.ThisEvening——"WhatAboutAStory?"SaidChristopherRobin."WhatAboutAStory?"ISaid."CouldYouVerySweetlyTellWinnie-The-PoohOne?""ISupposeICould,"ISaid."WhatSortOfStoriesDoesHeLike?""AboutHimself.BecauseHe'sThatSortOfBear.""Oh,ISee.""SoCouldYouVerySweetly?""I'llTry,"ISaid.SoITried.OnceUponATime,AVeryLongTimeAgoNow,AboutLastFriday,Winnie-The-PoohLivedInAForestAllByHimselfUnderTheNameOfSanders.("WhatDoes'UnderTheName'Mean?"AskedChristopherRobin."ItMeansHeHadTheNameOverTheDoorInGoldLetters,AndLivedUnderIt.""Winnie-The-PoohWasn'tQuiteSure,"SaidChristopherRobin."NowIAm,"SaidAGrowlyVoice."ThenIWillGoOn,"SaidI.)OneDayWhenHeWasOutWalking,HeCameToAnOpenPlaceInTheMiddleOfTheForest,AndInTheMiddleOfThisPlaceWasALargeOak-Tree,And,FromTheTopOfTheTree,ThereCameALoudBuzzing-Noise.Winnie-The-PoohSatDownAtTheFootOfTheTree,PutHisHeadBetweenHisPawsAndBeganToThink.FirstOfAllHeSaidToHimself:"ThatBuzzing-NoiseMeansSomething.YouDon'tGetABuzzing-NoiseLikeThat,JustBuzzingAndBuzzing,WithoutItsMeaningSomething.IfThere'sABuzzing-Noise,Somebody'sMakingABuzzing-Noise,AndTheOnlyReasonForMakingABuzzing-NoiseThatIKnowOfIsBecauseYou'reABee."ThenHeThoughtAnotherLongTime,AndSaid:"AndTheOnlyReasonForBeingABeeThatIKnowOfIsMakingHoney."AndThenHeGotUp,AndSaid:"AndTheOnlyReasonForMakingHoneyIsSoAsICanEatIt."SoHeBeganToClimbTheTree.HeClimbedAndHeClimbedAndHeClimbed,AndAsHeClimbedHeSangALittleSongToHimself.ItWentLikeThis:Isn'tItFunnyHowABearLikesHoney?Buzz!Buzz!Buzz!IWonderWhyHeDoes?ThenHeClimbedALittleFurther...AndALittleFurther...AndThenJustALittleFurther.ByThatTimeHeHadThoughtOfAnotherSong.It'sAVeryFunnyThoughtThat,IfBearsWereBees,They'dBuildTheirNestsAtTheBottomOfTrees.AndThatBeingSo(IfTheBeesWereBears),WeShouldn'tHaveToClimbUpAllTheseStairs.HeWasGettingRatherTiredByThisTime,SoThatIsWhyHeSangAComplainingSong.HeWasNearlyThereNow,AndIfHeJustStoodOnThatBranch...Crack!"Oh,Help!"SaidPooh,AsHeDroppedTenFeetOnTheBranchBelowHim.`;
image1.onload = function intialize() {
    //canvas.width = image1.width;
    //canvas.height = image1.height;
    canvas.width = 640;
    canvas.height = 640;
    effect = new AsciiEffect(ctx, image1, text, canvas.width, canvas.height);
    handleSlider();
}