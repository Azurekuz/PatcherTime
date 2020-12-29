class LoadTime{
    constructor(startDT, endDT, curDT=new Date()){
        this.startPoint = startDT;
        this.endPoint = endDT;
        this.curPoint = curDT;
    }

    updateElapsed(){
        this.curPoint = new Date();
        return this.getElapsed();
    }

    getElapsed(){
        return Math.abs(this.curPoint-this.startPoint);
    }

    getTotal(){
        return Math.abs(this.endPoint-this.startPoint);
    }
}

class Bar{
    constructor(current, total){
        this.curValue = current;
        this.maxValue = total;
        this.recalcPercent();
        this.isFull = false;
    }

    increment(incValue){
        this.curValue += incValue;
        this.recalcPercent();
    }

    updateCurrent(newValue){
        if(newValue>=this.maxValue){
            this.curValue=this.maxValue;
            if(!this.isFull){
                this.isFull = true;
            }
        }else{
            this.curValue = newValue;
            this.isFull=false;
        }
        //console.log(this.curValue + " | " + this.maxValue);
        this.recalcPercent();
    }

    recalcPercent(){
        this.percent = ((this.curValue/this.maxValue)*100).toFixed(2);
    }

    getPercent(){
        return this.percent;
    }
}

class MinorBar extends Bar{
    constructor(current, total){
        super(current, total);
        this.changeText = true;
    }

    updateCurrent(newValue){
        if(newValue>=this.maxValue){
            this.curValue=this.maxValue;
            if(!this.isFull){
                this.isFull = true;
                this.changeText = true;
            }
        }else{
            this.curValue = newValue;
            this.isFull=false;
        }
        //console.log(this.curValue + " | " + this.maxValue);
        this.recalcPercent();
    }

    increment(incValue){
        this.curValue += incValue;
        if(this.curValue > 100){
            this.curValue = 0;
        }
        this.recalcPercent();
    }

    getChangeText(){
        if(this.changeText){
            this.changeText=false;
            return true;
        }else{
            return this.changeText;
        }
    }
}

class MajorBar extends Bar{
    constructor(current, total){
        super(current, total);
    }
}

/**
 * Does NOT stand for "Real Money Trade" but rather
 * "Random Minor Time" in order to provide some randomness
 * with the speed/rate with which the minor bar fills up.
 */
class RMT{
    constructor(){
        this.chanceMatrix = [
            [0,[0.01,0.49]],[65,[0.5,1.5]],[75,[1,3]],
            [80,[3,5]],[85,[6,10]],[90,[10,30]],
            [95,[30,60]],[98,[60,360]],[100,[]]
        ];
    }

    getRMT(){
        var diceRoll = Math.floor(Math.random()*100);
        var range = this.getRange(diceRoll);
        return range;
    }

    getRange(roll){
        for(var index=0; index<this.chanceMatrix.length;index++){
            if(this.chanceMatrix[index][0] > roll){
                return this.chanceMatrix[index-1][1];
            }
        }
    }
}

class Patcher{
    constructor(currentMajor, totalMajor){
        this.majorLT = new LoadTime(currentMajor, totalMajor);
        
        this.rmt = new RMT();
        this.regenMinorRange();
        
        this.minorBar = new MinorBar(this.minorLT.getElapsed(), this.minorLT.getTotal());
        this.majorBar = new MajorBar(this.majorLT.getElapsed(), this.majorLT.getTotal());
    }

    getCurrentMinorValue(){
        return this.minorBar.curValue;
    }

    getCurrentMajorValue(){
        return this.majorBar.curValue;
    }

    update(){
        this.updateBars();
        return [this.minorBar.getPercent(), this.majorBar.getPercent(), this.minorBar.getChangeText()];
    }

    updateBars(){
        this.majorBar.updateCurrent(this.majorLT.updateElapsed());
        if(this.majorBar.getPercent()<100){
            if(this.minorBar.getPercent()>=100){
                this.regenMinorRange();
            }
            this.minorBar.updateCurrent(this.minorLT.updateElapsed());
        }else{
            this.minorBar.updateCurrent(this.minorLT.getTotal());
        }
    }

    regenMinorRange(){
        var rngAry = this.rmt.getRMT();
        var minorST=new Date(), minorET=new Date(this.addSecondsTo(minorST,(Math.random()*(rngAry[1]-rngAry[0])+rngAry[0]).toFixed(2)));
        this.minorLT = new LoadTime(minorST,minorET);
        this.minorBar = new MinorBar(this.minorLT.getElapsed(),this.minorLT.getTotal());
    }

    addSecondsTo(date, sec){
        return new Date((date.getTime()+Math.floor(sec*1000)))
    }
}

class TextLibrary{
    constructor(){
        this.library = [
            "Compiling rules and references...",
            "Reviewing spells...",
            "Brushing up on the art of Game Mastering...",
            "Not making a pen & paper Civ game...",
            "Hogging mental bandwidth on the braincell...",
            "Compiling needed lore and locale...",
            "Panicking over naming things...",
            "Crying over session preparation...",
            "Questioning life and GMing choices...",
            "Realizing I need more maps and tables...",
            "Making even more maps and tables...",
            "Finding background ambient music...",
            "Crying...",
            "Brainstorming ideas...",
            "Writing more lore...",
            "Preventing tech & table issues...",
            "Processing existential crises...",
            "Fleshing out possible unneeded details...",
            "Consulting oracles about the players...",
            "Screaming...",
            "Naming things...",
            "Naming nations and places...",
            "Describing things...",
            "Reinforcing world frames with steel...",
            "Finding out what my NPCs are up to...",
            "Darkening the corners and edges...",
            "And we're blending...",
            "Stowing away age-inappropriate substances...",
            "Providing mental health services to NPCs...",
            "Mentally preparing myself...",
            "Attempting to alleviate disasters...",
            "Making disasters more disasterous...",
            "Worldbuilding...",
            "Desummoning the Elder Gods...",
            "Resummoning the Elder Gods...",
            "Moving the moons...",
            "Processing 2020 trauma...",
            "Asking for potatoes with goats' cheese..."
        ];
        this.curLine;
    }

    generateLine(){
        var roll = Math.random()*this.library.length;
        while(roll == this.curLine){
            roll = Math.random()*this.library.length;
        }
        this.curLine = Math.floor(roll);
        console.log(this.library[this.curLine]);
        return this.library[this.curLine];
    }
}

class DisplayUpdater{
    constructor(doc, minID="minorBar", majID="majorBar", funID=null){
        this.document = doc;
        this.textLib = new TextLibrary();
        this.minorBarID=minID;
        this.minorTextID = minID + "Text";
        this.majorBarID=majID;
        this.majorTextID = majID + "Text";
        this.funTextID=funID;
    }

    updateBars(percentArray){
        this.updateMinorBar(percentArray[0], percentArray[2], percentArray[1]);
        this.updateMajorBar(percentArray[1]);
    }

    updateMinorBar(newValue, changeFunText, majorValue){
        this.document.getElementById(this.minorBarID).value = newValue;
        this.document.getElementById(this.minorBarID).style.width = newValue+'%';
        this.document.getElementById(this.minorTextID).innerHTML = newValue+"%";
        if(changeFunText && majorValue < 99){
            this.document.getElementById(this.funTextID).innerHTML = this.textLib.generateLine();
        }else if(changeFunText && majorValue >= 99 && majorValue < 100){
            this.document.getElementById(this.funTextID).innerHTML = "Finalizing...";  
        }else if(majorValue>=100){
            this.document.getElementById(this.funTextID).innerHTML = "Done!"  
        }
    }

    updateMajorBar(newValue){
        this.document.getElementById(this.majorBarID).value = newValue;
        this.document.getElementById(this.majorBarID).style.width = newValue+'%';
        this.document.getElementById(this.majorTextID).innerHTML = newValue+"%";
    }

    updateFunText(){

    }
}

class PatcherTime{
    constructor(startDT, endDT, document){
        this.patcher = new Patcher(startDT, endDT);
        this.displayView = new DisplayUpdater(document, "minorBar", "majorBar","funText");
    }

    update(){
        this.displayView.updateBars(this.patcher.update());
    }

    getMinorValue(){
        return this.patcher.getCurrentMinorValue();
    }

    getMajorValue(){
        return this.patcher.getCurrentMajorValue();
    }

    getMajorElapsed(){
        return this.majorTime.getElapsed();
    }

    getMajorTotal(){
        return this.majorTime.getTotal();
    }
}

//var testPatch = new PatcherTime(new Date(2020, 9, 7, 20, 0, 0), new Date(2020, 10, 19, 18, 0, 0), document);
var testPatch = new PatcherTime(new Date(2020, 10, 29, 10, 59, 9), new Date(2020, 11, 30, 18, 0, 0), document);
var updateInterval = setInterval(() => {
    testPatch.update();
},10);