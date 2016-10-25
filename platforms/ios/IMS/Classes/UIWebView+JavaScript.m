//
//  UIWebView+JavaScript.m
//  IMS
//
//  Created by Satoru Zhu on 2016/10/25.
//
//

#import "UIWebView+JavaScript.h"

@implementation UIWebView (JavaScript)

-(void)webView:(UIWebView *)sender runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(id)frame{
    UIAlertView* dialogue = [[UIAlertView alloc]initWithTitle:nil message:message delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
    [dialogue show];;
}

@end
