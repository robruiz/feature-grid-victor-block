/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { getUpdatedLinkAttributes } from './get-updated-link-attributes';

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
	MediaUploadCheck,
	BlockControls,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
	PanelRow,
	Button,
	ResponsiveWrapper,
	ToolbarButton,
	Popover
} from '@wordpress/components';

import {
	useEffect,
	useState,
	useRef,
	useMemo
} from '@wordpress/element';

import { displayShortcut, isKeyboardEvent, ENTER } from '@wordpress/keycodes';

import { useMergeRefs, useRefEffect } from '@wordpress/compose';

import { link , linkOff } from '../../node_modules/@wordpress/icons';

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
	const { attributes, setAttributes, isSelected } = props;

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

	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );

	function startEditing( event ) {
		event.preventDefault();
		setIsEditingURL( true );
	}

	function unlink() {
		setAttributes( {
			link: undefined
		} );
		setIsEditingURL( false );
	}

	const isURLSet = !! attributes.link;
	const isLinkTag = 'a';
	const linkURL = attributes.link;
	const opensInNewTab = false;
	const nofollow = 'nofollow';
	const richTextRef = useRef();
	/*const blockProps = useBlockProps( {
		ref: useMergeRefs( [ setPopoverAnchor ] ),
		onKeyDown,
	} );*/

	const LINK_SETTINGS = [
		...LinkControl.DEFAULT_LINK_SETTINGS,
		{
			id: 'nofollow',
			title: __( 'Mark as nofollow' ),
		},
	];

	useEffect( () => {
		if ( ! isSelected ) {
			setIsEditingURL( false );
		}
	}, [ isSelected ] );

	const linkValue = useMemo(
		() => ( { linkURL, opensInNewTab, nofollow } ),
		[ linkURL , false, null ]
	);

	const blockStyle = {
		backgroundImage: attributes.mediaUrl !== '' ? 'url("' + attributes.mediaUrl + '")' : 'none'
	};
	console.log([props, linkValue]);
	/*const useEnterRef = useEnter( { content: text, clientId } );
	const mergedRef = useMergeRefs( [ useEnterRef, richTextRef ] );*/
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
								<PanelRow>
									<MediaUpload
										onSelect={onSelectMedia}
										value={attributes.mediaId}
										allowedTypes={['image']}
										render={({open}) => (
											<PanelRow>
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
											</PanelRow>
										)}
									/>
								</PanelRow>
							</MediaUploadCheck>
							{attributes.mediaId !== 0 &&
								<MediaUploadCheck>
									<PanelRow>
									<MediaUpload
										title={__('Replace image', 'feature-grid-victor')}
										value={attributes.mediaId}
										onSelect={onSelectMedia}
										allowedTypes={['image']}
										render={({open}) => (
											<PanelRow>
												<Button onClick={open} isDefault
														isLarge>{__('Replace image', 'feature-grid-victor')}
												</Button>
											</PanelRow>
										)}
									/>
									</PanelRow>
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
			<BlockControls group="block">
					{ ! isURLSet && isLinkTag && (
						<ToolbarButton
							name="link"
							icon={ link }
							title={ __( 'Link' ) }
							shortcut={ displayShortcut.primary( 'k' ) }
							onClick={ startEditing }
						/>
					) }
					{ isURLSet && isLinkTag && (
						<ToolbarButton
							name="link"
							icon={ linkOff }
							title={ __( 'Unlink' ) }
							shortcut={ displayShortcut.primaryShift( 'k' ) }
							onClick={ unlink }
							isActive={ true }
						/>
					) }
			</BlockControls>
			{ isLinkTag && isSelected && ( isEditingURL || isURLSet ) && (
				<Popover
					placement="bottom"
					onClose={ () => {
						setIsEditingURL( false );
						richTextRef.current?.focus();
					} }
					anchor={ popoverAnchor }
					focusOnMount={ isEditingURL ? 'firstElement' : false }
					__unstableSlotName={ '__unstable-block-tools-after' }
					shift
				>
					<LinkControl
						value={ linkValue }
						onChange={ ( data ) => {
							console.log(data);
							setAttributes({
								link: data.url
							})
						}
						}
						onRemove={ () => {
							unlink();
							richTextRef.current?.focus();
						} }
						forceIsEditingLink={ isEditingURL }
						settings={ LINK_SETTINGS }
					/>
				</Popover>
			) }
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
