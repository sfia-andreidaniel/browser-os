window.CSSDefs = window.CSSDefs || {};

function CSSBorderStyleInput( value ) {
    return new DropDown([{
        "id": "",
        "name": "Default",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEwSURBVDiNrZOxisJAFEXPBIkghIlNRJgutiksUln7D36CpLEWrGxsLNKmsRG/JFiJZcRtsxaCICETbATZagU1WmT3lo9zDzPMPOE4zpdlWQ0qRGt9qVmW1bBtW1URAAejYvGeWtlQSslwOKTX62HbNkmSsNlsWC6XXK/XzwLDMJjP53S73fvM931830cpxXQ6feSfBZ1O516O45jBYECapgD0+30M47HycoLj8choNKLdbrPdbhFC0Gq1ADidTtxut8+CPM9Zr9cAeJ5HGIbU63WKomAymTzjr1f4jRCC2WyGlJKiKAiCgN1u98KVvgJAs9nENE3O5zOr1aq0/FEAEEURAPv9/i3zVqCUYjweA7BYLEiSpJT7808Urut+V92FLMv+YRe01hfgUKWstb78AE0MYGJdfC/XAAAAAElFTkSuQmCC"
    } , {
        "id": "none",
        "name": "None"
    } , {
        "id": "hidden",
        "name": "Hidden (usefull for tables instead of none)"
    } , {
        "id": "inherit",
        "name": "Inherited (from parent container)",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEwSURBVDiNrZOxisJAFEXPBIkghIlNRJgutiksUln7D36CpLEWrGxsLNKmsRG/JFiJZcRtsxaCICETbATZagU1WmT3lo9zDzPMPOE4zpdlWQ0qRGt9qVmW1bBtW1URAAejYvGeWtlQSslwOKTX62HbNkmSsNlsWC6XXK/XzwLDMJjP53S73fvM931830cpxXQ6feSfBZ1O516O45jBYECapgD0+30M47HycoLj8choNKLdbrPdbhFC0Gq1ADidTtxut8+CPM9Zr9cAeJ5HGIbU63WKomAymTzjr1f4jRCC2WyGlJKiKAiCgN1u98KVvgJAs9nENE3O5zOr1aq0/FEAEEURAPv9/i3zVqCUYjweA7BYLEiSpJT7808Urut+V92FLMv+YRe01hfgUKWstb78AE0MYGJdfC/XAAAAAElFTkSuQmCC"
    } , {
        "id": "dotted",
        "name": "Dotted",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADQSURBVDiN7dKxbYQwGIbh94xB1ok/QhSI4kTDAgzADAzAGKmYjcYD2AukDhUFQjFCJ1GQ7pp0KFWUr3+f6rsVRfEhIncuLISwaxG5Z1n2uAIAk7oYvvaXAGMMaZoCkCQJIoJSCq01IkIURSilEBHiOP4JDMPAOI4A9H2PtZayLGnbFmstTdNQVRXWWrquewFRnufvxpg3rTXTNOG9RynFsiw45ziOg33fcc6xbRvneeK9Z55nns/n162u68+rP1jX9f8HvwHoEMIOTFfiEML+Dc+QRbC9ibsuAAAAAElFTkSuQmCC"
    } , {
        "id": "dashed",
        "name": "Dashed",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADXSURBVDiN7ZIxioRAEABrDxFZGNDEQMwmMDGbVPyEf/Bd/sHcFxgLh6CBImgkDIigMhcc6wOMt6KmoQoa+uX7/q8Q4s0DtNabJYR4u64bPgkA489D8eYbAOszxHFMEAQA9H1P27akaYrjOADUdc2+7yRJwnmeVFX1L0opB6WUKcvSfCiKwiilzDRN9y7Pc5NlmTHGGK21UUoZKeXwklIOruuGYRjieR4Ay7IwzzNRFGHbNgBd13EcB1EUcV0XTdOwrut4B57cv67r95EAS2u9AeMTWWu9/QEEL2qtDoNIaAAAAABJRU5ErkJggg=="
    } , {
        "id": "solid",
        "name": "Solid",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABxSURBVDiN7ZKhCsAgFEXvhmnwwCSGNb/UX/Ff/Airs1mEC+alDdbGY3E3nXJOuotzrojIBsVITiMim7V21wQAtFUp3vsDgLkgpQTv/Ssp54wY4zNQSkHv/VWg1nrzEkI4tD8YY/w/+CJgSE4ATSOTnCftEiJjOGVciwAAAABJRU5ErkJggg=="
    } , {
        "id": "double",
        "name": "Double",
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB4SURBVDiNYxQTE7vJy8vLxUAG+Pz58zcWXl5eLgEBARlyDGBgYHjCRKZGOBh4A1hgjJqaGgYvLy+iNH358oXBzc0N1YALFy4w/Pv3jygDfvz4AWczKisrPyY3Fj58+EB5LIyGwaBIiZ8/f/7GwMDwhBzNnz9//gYABRg2ZGUgf08AAAAASUVORK5CYII="
    } , {
        "id": "groove",
        "name": "Groove"
    } , {
        "id": "ridge",
        "name": "Ridge"
    } , {
        "id": "inset",
        "name": "Inset"
    } , {
        "id": "outset",
        "name": "Outset"
    }]).addClass("CSSBorderStyleInput").chain( function() {
        if ( value )
            this.value = value;
    }).chain( function() {
        this.onchange = function() {
            this.onCustomEvent('change');
        }
    });
}