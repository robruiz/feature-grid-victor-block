/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck
} from '@wordpress/block-editor';

import { Panel, PanelBody, Button, ResponsiveWrapper } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( props ) {
	const { attributes, setAttributes } = props;

	const removeMedia = () => {
		props.setAttributes({
			mediaId: 0,
			mediaUrl: ''
		});
	}

	const onSelectMedia = (media) => {
		props.setAttributes({
			mediaId: media.id,
			mediaUrl: media.url
		});
	}

	const blockStyle = {
		backgroundImage: attributes.mediaUrl !== '' ? 'url("' + attributes.mediaUrl + '")' : 'none'
	};
	console.log(props);
    return (
		<button {...useBlockProps()}>
			<InspectorControls>
				<Panel>
					<PanelBody
						title={__('Select block background image', 'feature-grid-victor')}
						initialOpen={true}
					>
						<div className="editor-post-featured-image">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={onSelectMedia}
									value={attributes.mediaId}
									allowedTypes={['image']}
									render={({open}) => (
										<Button
											className={attributes.mediaId === 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
											onClick={open}
										>
											{attributes.mediaId === 0 && __('Choose an image', 'feature-grid-victor')}
											{props.media !== undefined &&
												<ResponsiveWrapper
													naturalWidth={props.media.media_details.width}
													naturalHeight={props.media.media_details.height}
												>
													<img src={props.media.source_url}/>
												</ResponsiveWrapper>
											}
										</Button>
									)}
								/>
							</MediaUploadCheck>
							{attributes.mediaId !== 0 &&
								<MediaUploadCheck>
									<MediaUpload
										title={__('Replace image', 'feature-grid-victor')}
										value={attributes.mediaId}
										onSelect={onSelectMedia}
										allowedTypes={['image']}
										render={({open}) => (
											<Button onClick={open} isDefault
													isLarge>{__('Replace image', 'feature-grid-victor')}</Button>
										)}
									/>
								</MediaUploadCheck>
							}
							{attributes.mediaId !== 0 &&
								<MediaUploadCheck>
									<Button onClick={removeMedia} isLink
											isDestructive>{__('Remove image', 'feature-grid-victor')}</Button>
								</MediaUploadCheck>
							}
						</div>
						{/* Your Code Here */}
					</PanelBody>
				</Panel>
			</InspectorControls>
			<RichText
				tagName="div" // The tag here is the element output and editable in the admin
				value={attributes.label} // Any existing content, either from the database or an attribute default
				allowedFormats={['core/bold', 'core/italic']} // Allow the content to be made bold or italic, but do not allow other formatting options
				onChange={(label) => setAttributes({label})} // Store updated content as a block attribute
				placeholder={__('label')} // Display this text before any content has been added by the user
				className="card-label"
			/>
			<div className="card-bottom">
				<RichText
					tagName="p" // The tag here is the element output and editable in the admin
					value={attributes.title} // Any existing content, either from the database or an attribute default
					allowedFormats={['core/bold', 'core/italic']} // Allow the content to be made bold or italic, but do not allow other formatting options
					onChange={(title) => setAttributes({title})} // Store updated content as a block attribute
					placeholder={__('This is just a placeholder title')} // Display this text before any content has been added by the user
					className="card-title"
				/>
				<RichText
					tagName="p" // The tag here is the element output and editable in the admin
					value={attributes.description} // Any existing content, either from the database or an attribute default
					allowedFormats={['core/bold', 'core/italic']} // Allow the content to be made bold or italic, but do not allow other formatting options
					onChange={(description) => setAttributes({description})} // Store updated content as a block attribute
					placeholder={__('Short description goes here')} // Display this text before any content has been added by the user
					className="card-description"
				/>
			</div>
		</button>
);
}
