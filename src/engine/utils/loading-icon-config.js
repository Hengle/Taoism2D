engine.LoadingIconConfig = (function () {

    let levelLoadCount = 0;

    let setup = function () {
        let cwidth = document.getElementById("LoadingIconParent").style.width;
        let cheight = document.getElementById("LoadingIconParent").style.height;
        document.getElementById("gameCanvas").width = cwidth.substr(0, cwidth.length - 2);
        document.getElementById("gameCanvas").height = cheight.substr(0, cheight.length - 2);
    };

    let start = function () {
        document.getElementById("LoadingScreenBar").style.display = "block";
        document.getElementById("gameCanvas").style.display = "none";
    };
    let stop = function () {
        levelLoadCount = 0;
        document.getElementById("LoadingScreenBar").style.width = "0%";
        document.getElementById("LoadingScreenBar").innerHTML = "0%";
        document.getElementById("LoadingScreenBar").style.display = "none";
        document.getElementById("gameCanvas").style.display = "block";
    };

    let loadingUpdate = function () {
        document.getElementById("LoadingScreenBar").style.width = Math.round(((levelLoadCount - engine.ResourceMap.getNumOutstandingLoads()) / levelLoadCount) * 100) - 1 + "%";
        document.getElementById("LoadingScreenBar").innerHTML = Math.round(((levelLoadCount - engine.ResourceMap.getNumOutstandingLoads()) / levelLoadCount) * 100) - 1 + "%";
    };

    let loadCountReset = function () {
        levelLoadCount = 0;
    };

    let isLevelSet = function () {
        return levelLoadCount !== 0;
    };

    let getLevelLoadCount = function () {
        return levelLoadCount;
    };

    let loadCountSet = function () {
        levelLoadCount = engine.ResourceMap.getNumOutstandingLoads();
    };

    let mPublic = {
        setup,
        start,
        stop,
        loadingUpdate,
        loadCountReset,
        isLevelSet,
        getLevelLoadCount,
        loadCountSet
    };
    return mPublic;

}());
