import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class Upload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentFile: props.uploadedFile
		};
	}

	onUpload = (acceptedFiles, rejectedFiles) => {
		const { onFileUpload } = this.props;

		if (acceptedFiles && acceptedFiles.length > 0) {
			this.setState({
				currentFile: acceptedFiles
			});
			onFileUpload(acceptedFiles);
		}
	};

	render() {
		const { currentFile } = this.state;
		return (
			<section className="container">
				<Dropzone onDrop={this.onUpload} accept="image/*" className="custom-upload-container">
					{({ getRootProps, getInputProps }) => (
						<div {...getRootProps({ className: 'dropzone' })}>
							<input {...getInputProps()} />
							{!currentFile || (typeof currentFile === 'string' && <div>Upload your picture here.</div>)}
							{typeof currentFile === 'object' && <div>{currentFile[0].name}</div>}
						</div>
					)}
				</Dropzone>
			</section>
		);
	}
}

export default Upload;
