import * as React from 'react';
import * as serialize from 'form-serialize';
import Async from 'react-select/async-creatable';
import {TreeService} from "../../model/TreeService";
import { translate } from 'react-polyglot'

interface TreeModePropsInterface {
    location: any
    t: any;
}

interface TreeModeStateInterface {
    type: string;
    image: string;
    email: string;
    successMessage: string;
    errorMessage: string;
}

class TreeMode extends React.Component<TreeModePropsInterface, TreeModeStateInterface> {

    private readonly form: any;

    public state: TreeModeStateInterface = {
        type: undefined,
        email: '',
        image: null,
        successMessage: null,
        errorMessage: null
    };

    constructor(props) {
        super(props);
        this.form = React.createRef();
    }

    onSubmit = (event) => {
        event.preventDefault();

        this.setState({
            errorMessage: null
        });

        if (!this.state.email) {
            this.setState({
                errorMessage: 'Obavezno je uneti i-mejl adresu.'
            });
            return;
        }

        if (!this.state.type) {
            this.setState({
                errorMessage: 'Obavezno je uneti vrstu.'
            });
            return;
        }

        const data = serialize(this.form.current, {hash: true});

        data.image = this.state.image;

        TreeService.saveTree(data)
            .then((response) => {
                this.setState({
                    successMessage: "Podaci su sačuvani i čekaju odobrenje moderatora.",
                    errorMessage: null,
                });
            })
            .catch((response) => {
                this.setState({
                    errorMessage: "Došlo je do greške. Pokušajte ponovo.",
                    successMessage: null,
                });
            });
    };

    loadOptions = (inputValue, callback, value) => {
        TreeService.autocomplete(inputValue)
            .then((data) => callback(Object.values(data)))
            .catch(() => callback([value]));
    };

    fileTypeAllowed = file => {
        if (file.type === "image/jpg") {
            return true;
        }

        if (file.type === "image/jpeg") {
            return true;
        }

        if (file.type === "image/png") {
            return true;
        }

        return false;
    };

    handleFileSelect = event => {
        let f = event.target.files[0];
        let reader = new FileReader();

        reader.onload = ((file) => {
            return (event) => {
                if (!this.fileTypeAllowed(file)) {
                    this.setState({errorMessage: "Dozvoljeni format slike je jpg ili png."});

                    return;
                }

                let binaryData = event.target.result;

                let base64String = window.btoa(binaryData);

                this.setState({
                    image: base64String
                })
            };
        })(f);
        reader.readAsBinaryString(f);
    };

    render = () => {
        const { t } = this.props;

        return <div className={'d-flex flex-column'}>
            <div className="alert alert-warning d-flex" style={{alignItems: 'center'}}>
                <i style={{fontSize: 40}} className="fa fa-map-marker pr-3" aria-hidden="true"/>
                <span style={{fontSize: 14}}>{ t('tree-info') }</span>
            </div>

            {this.state.errorMessage &&
            <div className="alert alert-danger">
              <span>{this.state.errorMessage}</span>
            </div>
            }

            {this.state.successMessage && !this.state.errorMessage &&
                <div className="alert alert-success">
                  <span>{this.state.successMessage}</span>
                </div>
            }

            <form ref={this.form}>
                <input type="hidden" name="latitude" value={this.props.location.lat}/>
                <input type="hidden" name="longitude" value={this.props.location.lng}/>
                <input type="hidden" name="type" value={JSON.stringify(this.state.type)}/>
                <input type="email" name="email" placeholder={t('Email')} value={this.state.email} className="form-control mb-1"
                    onChange={event => this.setState({email: event.target.value})}
                />
                <Async
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: '#245221',
                        },
                    })}
                    classNamePrefix="my-select"
                    className="mb-1"
                    allowCreateWhileLoading={true}
                    getNewOptionData={(inputValue, optionLabel) => {
                        return {serbian: inputValue, latin: '', id: null}
                    }}
                    cacheOptions
                    formatCreateLabel={(inputValue) => 'Kreirajte vrstu ' + inputValue}
                    loadOptions={(inputValue, callback) => this.loadOptions(inputValue, callback, '')}
                    defaultOptions
                    placeholder={t('Type')}
                    value={this.state.type}
                    noOptionsMessage={() => 'Nema rezultata'}
                    loadingMessage={() => 'Pretraživanje'}
                    onChange={option => this.setState({type: option})}
                    formatOptionLabel={option => <span>{option.serbian} <i>{option.latin}</i></span>}
                />
                <input type="number" name="age" placeholder={t('Age')} min="0" className="form-control mb-1"/>
                <div className="custom-file mb-1">
                    <input type="file" name="file" className="custom-file-input" id="custom-file"
                           onChange={this.handleFileSelect}/>
                    <label className="custom-file-label" htmlFor="custom-file">{t('Photo')}</label>
                </div>
                <button className="btn-primary btn mx-auto d-block w-100" onClick={this.onSubmit}>{t('Send')}</button>
            </form>
        </div>
    }
}

export default translate()(TreeMode);