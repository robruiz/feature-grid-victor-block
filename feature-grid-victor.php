<?php
/**
 * Plugin Name:       Feature Grid Victor Block
 * Description:       Blocks to display grid of features cards.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Rob Ruiz
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       feature-grid-victor
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function feature_grid_victor_feature_grid_victor_block_init() {
	register_block_type( __DIR__ . '/build/feature-grid-nav' );
	register_block_type( __DIR__ . '/build/feature-grid-card' );
}
add_action( 'init', 'feature_grid_victor_feature_grid_victor_block_init' );

function feature_grid_victor_register_block_pattern() {
	register_block_pattern(
		'feature-grid-victor/feature-section',
		array(
			'title'       => __( 'Victor Feature Section', 'feature-grid-victor' ),
			'content'     => file_get_contents( plugin_dir_path( __FILE__ ) . 'patterns/feature-section.html' ),
			'keywords'    => array( 'feature', 'grid', 'victor' ),
		)
	);
}
add_action( 'init', 'feature_grid_victor_register_block_pattern' );
