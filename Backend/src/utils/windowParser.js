const parseWindow = (window) => {
    switch (window) {
        case "1m":
            return 60;

        case "5m":
            return 300;

        case "1h":
            return 3600;

        case "1d":
            return 86400;

        default:
            return 60;
    }
};

export default parseWindow;