import * as React from 'react';
import {getStyle} from "./styles";
import styled from 'styled-components';
import {getCategory, IndexMode} from "./IndexMode";
import {TreeMode} from "./TreeMode";
import {TreeService} from "../../model/TreeService";

declare var google: any;

const mapElementStyle = {
    minHeight: "calc(100vh - 56px)",
    width: "100%",
};

const SideNavigation = styled.aside`
    width: 450px;
    minHeight: calc(100vh - 56px);
    display: flex;
    flex-direction: column;
`;

interface TreeIndexMapStateInterface {
    mode: string;
    dataSource: string;
    indexValue: number;
    marker: any;
    markerLocation: any;
}

const mapCenter = {lat: 43.8, lng: 21.5};

export class TreeIndexMap extends React.Component<any, TreeIndexMapStateInterface> {

    public static MODE_INDEX = 'index';
    public static MODE_TREE = 'tree';

    private readonly mapElement: any;

    private map: any;

    private trees: any = [];

    public state: any;

    constructor(props) {
        super(props);

        this.mapElement = React.createRef();

        this.state = {
            mode: TreeIndexMap.MODE_INDEX,
            dataSource: IndexMode.DATA_PINUS_NIGRA,
            markerLocation: mapCenter
        };
    }

    componentDidMount = () => {
        this.map = new google.maps.Map(this.mapElement.current, {
            mapTypeControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            zoom: 7,
            center: mapCenter,
            styles: getStyle(),
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
        });

        this.setData(this.state.dataSource);
    };

    setData = (dataSource) => {
        const globals: any = window["globals"];

        this.map.data.forEach((feature) => {
            this.map.data.remove(feature);
        });

        this.map.data.loadGeoJson(globals.baseUrl + `/public/data/${dataSource}.json`);

        this.map.data.addListener('mouseover', (event) => {
            this.setState({
                indexValue: event.feature.l.id,
            });
        });

        this.map.data.setStyle(function (feature) {
            let id = feature.getProperty('id');

            const category = getCategory(id);

            return {
                fillColor: category.color,
                strokeWeight: 0
            }
        });
    };

    getButtonClass = (mode: string) => {
        let classes = ['btn', 'w-100', 'mb-1'];

        if (mode === this.state.mode) {
            classes.push('btn-success');
        } else {
            classes.push('btn-secondary');
        }

        return classes.join(' ');
    };

    onDataSourceChange = (dataSource) => {
        this.setState({
            dataSource: dataSource
        });

        this.setData(dataSource);
    };

    onModeChange(mode) {
        this.setState({mode: mode});

        if (mode === TreeIndexMap.MODE_TREE) {
            const globals: any = window["globals"];

            this.setMarker();

            const infowindow = new google.maps.InfoWindow({
                content: 'Test'
            });

            TreeService.list().then((data) => {
                Object.keys(data).forEach((index) => {
                    const item = data[index];

                    const marker = new google.maps.Marker({
                        position: new google.maps.LatLng(item.latitude, item.longitude),
                        map: this.map,
                        icon: globals.baseUrl + '/public/images/tree.png',
                        data: item
                    });

                    marker.addListener('click', () => {
                        const {type} = marker.data;
                        let content = '';

                        let typeString = 'Nepoznata';

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
                            const image = globals.baseUrl + '/' + item.photo;

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

    setMarker() {
        this.state.marker = new google.maps.Marker({
            position: this.map.getCenter(),
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
        });

        google.maps.event.addListener(this.state.marker, 'dragend', event =>
            this.setState({
                markerLocation: {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                }
            })
        );
    }

    unsetMarker = () => {
        if (this.state.marker) {
            this.state.marker.setMap(null);
            this.state.marker = null;
        }
    };

    render = () => {
        return <div className={'d-flex'}>
            <SideNavigation className={'bg-light p-3'}>
                <div className={'mb-1'}>
                    <button className={this.getButtonClass(TreeIndexMap.MODE_INDEX)}
                            onClick={() => this.onModeChange(TreeIndexMap.MODE_INDEX)}>Gde pošumiti?
                    </button>
                    <button className={this.getButtonClass(TreeIndexMap.MODE_TREE)}
                            onClick={() => this.onModeChange(TreeIndexMap.MODE_TREE)}>Zadite drvo
                    </button>
                </div>
                {this.state.mode === TreeIndexMap.MODE_INDEX && <IndexMode value={this.state.indexValue}
                                                                           dataSource={this.state.dataSource}
                                                                           onDataSourceChange={this.onDataSourceChange}
                />}
                {this.state.mode === TreeIndexMap.MODE_TREE && <TreeMode location={this.state.markerLocation} />}
            </SideNavigation>
            <div ref={this.mapElement} style={mapElementStyle} />
        </div>
    };
}
