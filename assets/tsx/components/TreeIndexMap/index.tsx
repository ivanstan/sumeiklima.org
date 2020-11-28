import * as React from "react";
import { getStyle } from "./styles";
import styled from "styled-components";
import IndexMode from "./IndexMode";
import TreeMode from "./TreeMode";
import { TreeService } from "../../model/TreeService";
import * as globalMercator from "global-mercator";
import { geoJsonServer } from "../../config";
import { SideBarToggleButton } from "./SideBarToggleButton";
import { I18n } from "react-polyglot";

declare var google: any;

const mapElementStyle = {
    minHeight: "calc(100vh - 56px)",
    width: "100%",
};

const SideNavigation = styled.aside`
    width: 500px;
    minHeight: calc(100vh - 56px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

interface TreeIndexMapStateInterface {
    mode: string;
    dataSource: string;
    indexValue: number;
    marker: any;
    markerLocation: any;
    loading: boolean;
    progress: number;
    sideBarVisible: boolean;
    messages: any;
}

const mapCenter = { lat: 44.787197, lng: 20.457273 };

export class TreeIndexMap extends React.Component<any, TreeIndexMapStateInterface> {

    public static MODE_INDEX = "index";
    public static MODE_TREE = "tree";

    private readonly mapElement: any;

    private map: any;

    private trees: any = [];

    public state: any = {
        mode: TreeIndexMap.MODE_INDEX,
        dataSource: IndexMode.DATA_PINUS_NIGRA,
        markerLocation: mapCenter,
        progress: 0,
        sideBarVisible: true,
        messages: null
    };

    public tiles: any = {};

    constructor(props) {
        super(props);

        this.mapElement = React.createRef();
    }

    mapMinZoom = 1;
    mapMaxZoom = 14;

    mapBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(41.787740, 18.816127),
        new google.maps.LatLng(46.188934, 23.006101));

    maptiler =  new google.maps.ImageMapType({
        getTileUrl: (coord, zoom) => {
            var dataSource = this.state.dataSource;
            var proj = this.map.getProjection();
            var z2 = Math.pow(2, zoom);
            var tileXSize = 256 / z2;
            var tileYSize = 256 / z2;
            var tileBounds = new google.maps.LatLngBounds(
                proj.fromPointToLatLng(new google.maps.Point(coord.x * tileXSize, (coord.y + 1) * tileYSize)),
                proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileXSize, coord.y * tileYSize))
            );
            var x = coord.x >= 0 ? coord.x : z2 + coord.x
            var y = coord.y;
            if (this.mapBounds.intersects(tileBounds) && (this.mapMinZoom <= zoom) && (zoom <= this.mapMaxZoom))
                return 'https://static.spacehub.rs/forest-and-climate/maptiles/' + dataSource + '/' + zoom + "/" + x + "/" + y + ".png";
            else
                return "https://www.maptiler.com/img/none.png";
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        name: "Rendered with MapTiler Desktop <https://www.maptiler.com/desktop/>",
        alt: "Rendered with MapTiler Desktop",

        opacity: .5
    });

    componentDidMount = () => {
        this.getMessages().then(data => this.setState({ messages: data }));

        this.map = new google.maps.Map(this.mapElement.current, {
            mapTypeControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            zoom: 10,
            center: mapCenter,
            styles: getStyle(),
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
        });

        this.loadData();
    };

    getMessages = async () => {
        const globals: any = window["globals"];
        const response = await fetch(globals.baseUrl + `/translations/messages.${this.props.locale}.json`);

        return await response.json();
    };

    loadData = () => {
        this.map.overlayMapTypes.removeAt(0);
        this.map.overlayMapTypes.insertAt(0, this.maptiler);
    };

    getTiles = () => {
        const bounds = this.map.getBounds(),
            boundsNeLatLng = bounds.getNorthEast(),
            boundsSwLatLng = bounds.getSouthWest(),
            boundsNwLatLng = new google.maps.LatLng(boundsNeLatLng.lat(), boundsSwLatLng.lng()),
            boundsSeLatLng = new google.maps.LatLng(boundsSwLatLng.lat(), boundsNeLatLng.lng()),
            zoom = this.map.getZoom();
        let tiles = [];

        let lng = boundsSwLatLng.lng(),
            lat = boundsSwLatLng.lat();

        const tile = globalMercator.lngLatToGoogle([lng, lat], zoom);
        const [minX, minY, maxX, maxY] = globalMercator.googleToBBox(tile);
        const tileSizeX = maxX - minX;
        const tileSizeY = maxY - minY;

        const maxLat = boundsNwLatLng.lat();

        while (lat < maxLat) {
            lng = boundsSwLatLng.lng();

            let row = [];
            while (lng < boundsSeLatLng.lng()) {
                const tile = globalMercator.lngLatToGoogle([lng, lat], zoom);

                row.push(tile);

                lng = lng + tileSizeX;
            }

            tiles = tiles.concat(row);

            lat = lat + tileSizeY;
        }

        return tiles;
    };

    loadTile = (x, y, z) => {
        if (this.isTileLoaded(x, y, z)) {
            return;
        }

        const file = this.state.dataSource;

        this.setTile(x, y, z);
        this.map.data.loadGeoJson(`${geoJsonServer}/${file}/${z}/${x}/${y}.geojson`);
    };

    clearData = () => {
        this.map.data.forEach((feature) => {
            this.map.data.remove(feature);
        });
        this.tiles = {};
    };

    setTile = (x, y, z) => {
        if (!this.tiles.hasOwnProperty(x)) {
            this.tiles[x] = {};
        }

        if (!this.tiles[x].hasOwnProperty(x)) {
            this.tiles[x][y] = {};
        }

        this.tiles[x][y][z] = true;
    };

    isTileLoaded = (x, y, z) => {
        return this.tiles.hasOwnProperty(x) && this.tiles[x].hasOwnProperty(y) && this.tiles[x][y].hasOwnProperty(z) && this.tiles[x][y][z] === true;
    };

    getButtonClass = (mode: string) => {
        let classes = ["btn", "w-100", "mb-1"];

        if (mode === this.state.mode) {
            classes.push("btn-success");
        } else {
            classes.push("btn-secondary");
        }

        return classes.join(" ");
    };

    onDataSourceChange = (dataSource) => {
        this.setState({
            dataSource: dataSource
        });

        this.loadData();
    };

    onModeChange = mode => {
        this.setState({ mode: mode });

        if (mode === TreeIndexMap.MODE_TREE) {
            this.clearData();

            const globals: any = window["globals"];

            this.setMarker();

            const infowindow = new google.maps.InfoWindow({
                content: "Test"
            });

            TreeService.list().then((data) => {
                Object.keys(data).forEach((index) => {
                    const item = data[index];

                    const marker = new google.maps.Marker({
                        position: new google.maps.LatLng(item.latitude, item.longitude),
                        map: this.map,
                        icon: globals.baseUrl + "/public/images/tree.png",
                        data: item
                    });

                    marker.addListener("click", () => {
                        const { type } = marker.data;
                        let content = "";

                        let typeString = "Nepoznata";

                        if (type.serbian) {
                            typeString = type.serbian;
                        }

                        if (type.latin) {
                            typeString += ` <i>${type.latin}</i>`;
                        }

                        if (typeString) {
                            content += `Vrsta: ${typeString}<br>`;
                        }

                        if (item.age) {
                            content += `Starost: ${item.age} godina<br>`;
                        }

                        if (item.photo) {
                            const image = globals.baseUrl + "/" + item.photo;

                            content += `<br/><img src="${image}" width="200px"/>`;
                        }

                        if (content) {
                            infowindow.setContent(content);
                            infowindow.open(this.map, marker);
                        }
                    });

                    this.trees.push(marker);
                })
            });
        }

        if (mode === TreeIndexMap.MODE_INDEX) {
            this.unsetMarker();

            this.trees.forEach((marker) => {
                marker.setMap(null);
            });

            this.trees = [];
        }
    };

    setMarker = () => {
        this.state.marker = new google.maps.Marker({
            position: this.map.getCenter(),
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
        });

        google.maps.event.addListener(this.state.marker, "dragend", event =>
            this.setState({
                markerLocation: {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                }
            })
        );
    };

    unsetMarker = () => {
        if (this.state.marker) {
            this.state.marker.setMap(null);
            this.state.marker = null;
        }
    };

    onSideBarToggle = () => {
        this.setState((prevState => {

            return {
                sideBarVisible: !prevState.sideBarVisible,
            };
        }));
    };

    render = () => {
        const globals: any = window["globals"];
        const { messages, sideBarVisible } = this.state;
        const { locale } = this.props

        return (
            <>
                <div className={"d-flex"} style={{ maxHeight: "calc(100vh - 56px)" }}>
                    {sideBarVisible && <SideNavigation className={"bg-light p-3"}>
                        <div className={"mb-1"}>
                            <button className={this.getButtonClass(TreeIndexMap.MODE_INDEX)}
                                    onClick={() => this.onModeChange(TreeIndexMap.MODE_INDEX)}>{locale === 'en' ? 'Where to plant?' : 'Gde pošumiti?'}
                            </button>
                            <button className={this.getButtonClass(TreeIndexMap.MODE_TREE)}
                                    onClick={() => this.onModeChange(TreeIndexMap.MODE_TREE)}>{locale === 'en' ? 'Plant a tree' : 'Zasadite drvo'}
                            </button>
                        </div>
                        {this.state.mode === TreeIndexMap.MODE_INDEX && this.state.messages !== null &&
                        <I18n locale={this.props.locale} messages={messages}>
                            <IndexMode value={this.state.indexValue}
                                       dataSource={this.state.dataSource}
                                       onDataSourceChange={this.onDataSourceChange}
                            />
                        </I18n>
                        }
                        {this.state.mode === TreeIndexMap.MODE_TREE && this.state.messages !== null &&
                        <I18n locale={this.props.locale} messages={messages}>
                            <TreeMode location={this.state.markerLocation}/>
                        </I18n>
                        }
                    </SideNavigation>}
                    <div ref={this.mapElement} className="map-container" style={mapElementStyle}/>
                </div>
                <SideBarToggleButton onClick={this.onSideBarToggle}/>
            </>
        )
    };
}
