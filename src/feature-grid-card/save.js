/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';
/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( props ) {
    const { attributes, setAttributes } = props;

    const titleContent = (
        <RichText.Content
            tagName='strong'
            value={attributes.title}
            className="card-title"
        />
    );
    console.log(attributes);

    return (
        <button {...useBlockProps.save()} role="button" tabindex="0" data-link={attributes.link} >
            <RichText.Content
                tagName='div'
                value={ attributes.label }
                className="card-label"
            />
            <div class="card-bottom">
                {
                    titleContent
                }
                <RichText.Content
                    tagName='p'
                    value={ attributes.description }
                    className="card-description"
                />
            </div>
			{ attributes.mediaUrl && <img src={attributes.mediaUrl} /> }
        </button>
    );
}
