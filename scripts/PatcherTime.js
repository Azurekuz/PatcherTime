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
    }

    increment(incValue){
        this.curValue += incValue;
        this.recalcPercent();
    }

    updateCurrent(newValue){
        this.curValue = newValue;
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
    }

    increment(incValue){
        this.curValue += incValue;
        if(this.curValue > 100){
            this.curValue = 0;
        }
        this.recalcPercent();
    }
}

class MajorBar extends Bar{
    constructor(current, total){
        super(current, total);
    }
}

class Patcher{
    constructor(currentMajor, totalMajor){
        this.minorBar = new MinorBar(0, 100);
        this.majorBar = new MajorBar(currentMajor, totalMajor);
    }

    getCurrentMinorValue(){
        return this.minorBar.curValue;
    }

    getCurrentMajorValue(){
        return this.majorBar.curValue;
    }

    update(majorUpdate){
        this.updateBars(majorUpdate);
        return [this.minorBar.getPercent(), this.majorBar.getPercent()];
    }

    updateBars(majorUpdate){
        this.minorBar.increment(10);
        this.majorBar.updateCurrent(majorUpdate);
    }

    getPercents(){

    }
}

class DisplayUpdater{
    constructor(doc, minID="minorBar", majID="majorBar", funID=null){
        this.document = doc;
        this.minorBarID=minID;
        this.minorTextID = minID + "Text";
        this.majorBarID=majID;
        this.majorTextID = majID + "Text";
        this.funTextID=funID;
    }

    updateBars(percentArray){
        this.updateMinorBar(percentArray[0]);
        this.updateMajorBar(percentArray[1]);
    }

    updateMinorBar(newValue){
        this.document.getElementById(this.minorBarID).value = newValue;
        this.document.getElementById(this.minorTextID).innerHTML = newValue+"%";
    }

    updateMajorBar(newValue){
        this.document.getElementById(this.majorBarID).value = newValue;
        this.document.getElementById(this.majorTextID).innerHTML = newValue+"%";
    }

    updateFunText(){

    }
}

class PatcherTime{
    constructor(startDT, endDT, document){
        this.majorTime = new LoadTime(startDT, endDT);
        this.patcher = new Patcher(this.getMajorElapsed(), this.getMajorTotal());
        this.displayView = new DisplayUpdater(document)
        /*console.log(this.startPoint);
        console.log(this.endPoint);
        console.log(this.curPoint);*/
    }

    update(){
        this.displayView.updateBars(this.patcher.update(this.majorTime.updateElapsed()));
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

var testPatch = new PatcherTime(new Date(2020, 9, 7, 20, 0, 0), new Date(2020, 10, 16, 12, 30, 0), document);
var updateInterval = setInterval(() => {
    testPatch.update();
},10);